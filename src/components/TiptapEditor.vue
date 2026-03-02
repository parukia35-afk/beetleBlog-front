<template>
  <div v-if="editor" class="tiptap-editor-wrapper border rounded-lg overflow-hidden">
    <div class="toolbar d-flex flex-wrap pa-1 bg-grey-lighten-4 border-b">
      <div class="toolbar-group d-flex align-center mr-1">
        <v-btn
          icon="mdi-format-bold"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().toggleBold().run()"
          v-tooltip="'粗體'"
        />
        <v-btn
          icon="mdi-format-italic"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().toggleItalic().run()"
          v-tooltip="'斜體'"
        />
        <v-btn
          icon="mdi-format-underline"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().toggleUnderline().run()"
          v-tooltip="'底線'"
        />
        <v-btn
          icon="mdi-format-strikethrough"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().toggleStrike().run()"
          v-tooltip="'刪除線'"
        />
      </div>

      <v-divider vertical class="mx-1 my-2" />

      <div class="toolbar-group d-flex align-center mx-1">
        <v-btn
          icon="mdi-format-color-text"
          variant="text"
          density="compact"
          color="background"
          :style="{ color: editor.getAttributes('textStyle').color }"
          v-tooltip="'文字顏色'"
        >
          <v-icon icon="mdi-format-color-text" />
          <v-menu activator="parent">
            <v-color-picker
              hide-inputs
              show-swatches
              @update:model-value="(color) => editor.chain().focus().setColor(color).run()"
            />
          </v-menu>
        </v-btn>
      </div>

      <v-divider vertical class="mx-1 my-2" />

      <div class="toolbar-group d-flex align-center mx-1">
        <v-btn
          icon="mdi-format-paragraph"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().setParagraph().run()"
          v-tooltip="'本文'"
        />
        <v-btn
          v-for="level in [1, 2, 3]"
          :key="level"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().toggleHeading({ level }).run()"
        >
          H{{ level }}
        </v-btn>
      </div>

      <v-divider vertical class="mx-1 my-2" />

      <div class="toolbar-group d-flex align-center mx-1">
        <v-btn
          icon="mdi-format-align-left"
          variant="text"
          density="compact"
          color="background"
          :active="editor.isActive({ textAlign: 'left' })"
          @click="editor.chain().focus().setTextAlign('left').run()"
          v-tooltip="'置左'"
        />
        <v-btn
          icon="mdi-format-align-center"
          variant="text"
          density="compact"
          color="background"
          :active="editor.isActive({ textAlign: 'center' })"
          @click="editor.chain().focus().setTextAlign('center').run()"
          v-tooltip="'置中'"
        />
        <v-btn
          icon="mdi-format-align-right"
          variant="text"
          density="compact"
          color="background"
          :active="editor.isActive({ textAlign: 'right' })"
          @click="editor.chain().focus().setTextAlign('right').run()"
          v-tooltip="'置右'"
        />
        <v-btn
          icon="mdi-format-align-justify"
          variant="text"
          density="compact"
          color="background"
          :active="editor.isActive({ textAlign: 'justify' })"
          @click="editor.chain().focus().setTextAlign('justify').run()"
          v-tooltip="'左右對齊'"
        />
      </div>

      <v-divider vertical class="mx-1 my-2" />

      <div class="toolbar-group d-flex align-center mx-1">
        <v-btn
          icon="mdi-format-list-bulleted"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().toggleBulletList().run()"
          v-tooltip="'項目符號'"
        />
        <v-btn
          icon="mdi-format-list-numbered"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().toggleOrderedList().run()"
          v-tooltip="'編號清單'"
        />
        <v-btn
          icon="mdi-minus"
          variant="text"
          density="compact"
          color="background"
          @click="editor.chain().focus().setHorizontalRule().run()"
          v-tooltip="'分隔線'"
        />
      </div>

      <v-divider vertical class="mx-1 my-2" />

      <div class="toolbar-group d-flex align-center mx-1">
        <v-btn
          icon="mdi-image-plus"
          variant="text"
          density="compact"
          color="background"
          @click="addImage"
          v-tooltip="'插入圖片'"
        />

        <v-menu>
          <template #activator="{ props }">
            <v-btn
              icon="mdi-table"
              variant="text"
              density="compact"
              v-bind="props"
              color="background"
              v-tooltip="'表格工具'"
            />
          </template>
          <v-list density="compact">
            <v-list-item
              prepend-icon="mdi-table-plus"
              title="插入表格"
              @click="
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              "
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-table-row-plus-after"
              title="下方插入列"
              @click="editor.chain().focus().addRowAfter().run()"
            />
            <v-list-item
              prepend-icon="mdi-table-row-remove"
              title="刪除此列"
              @click="editor.chain().focus().deleteRow().run()"
            />
            <v-list-item
              prepend-icon="mdi-table-column-plus-after"
              title="右方插入欄"
              @click="editor.chain().focus().addColumnAfter().run()"
            />
            <v-list-item
              prepend-icon="mdi-table-column-remove"
              title="刪除此欄"
              @click="editor.chain().focus().deleteColumn().run()"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-table-merge-cells"
              title="合併儲存格"
              @click="editor.chain().focus().mergeCells().run()"
            />
            <v-list-item
              prepend-icon="mdi-table-remove"
              title="刪除整個表格"
              color="error"
              @click="editor.chain().focus().deleteTable().run()"
            />
          </v-list>
        </v-menu>
      </div>

      <v-spacer />

      <div class="toolbar-group d-flex align-center">
        <v-btn
          icon="mdi-undo"
          variant="text"
          density="compact"
          color="background"
          :disabled="!editor.can().undo()"
          @click="editor.chain().focus().undo().run()"
        />
        <v-btn
          icon="mdi-redo"
          variant="text"
          density="compact"
          color="background"
          :disabled="!editor.can().redo()"
          @click="editor.chain().focus().redo().run()"
        />
      </div>
    </div>

    <editor-content :editor="editor" class="tiptap-content pa-4" />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { useApi } from '@/composables/api'
import { TextAlign } from '@tiptap/extension-text-align'

const { authApi } = useApi()

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    TextAlign.configure({
      types: ['heading', 'paragraph'], // 支援標題與段落
      alignments: ['left', 'center', 'right', 'justify'], // 支援的對齊方式
      defaultAlignment: 'left'
    }),
    Image.configure({
      allowBase64: true
    }),
    Table.configure({
      resizable: true
    }),
    TableRow,
    TableHeader,
    TableCell
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

const addImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'

  input.onchange = async () => {
    const file = input.files[0]
    if (!file) return

    const fd = new FormData()
    fd.append('image', file)

    try {
      const { data } = await authApi.post('/article/upload', fd)
      if (editor.value) {
        editor.value.chain().focus().setImage({ src: data.result }).run()
      }
    } catch (error) {
      console.error(error)
      alert('圖片上傳失敗')
    }
  }
  input.click()
}

// 監聽 modelValue (編輯舊文章時填入內容)
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val, false)
    }
  }
)
</script>

<style lang="scss">
.tiptap-editor-wrapper {
  background: white;
  .tiptap-content {
    min-height: 450px;
    max-height: 700px;
    overflow-y: auto;
    .ProseMirror {
      outline: none;
      p {
        margin-bottom: 0.5em;
      }
      h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #eee;
      }
      h2 {
        font-size: 1.5rem;
        margin-bottom: 0.8rem;
      }
      h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
      }

      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1rem 0;
        border: 1px solid #ddd;
        td,
        th {
          border: 1px solid #ddd;
          padding: 10px;
          min-width: 50px;
        }
        th {
          background: #f8f8f8;
          font-weight: bold;
        }
      }

      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1.5rem auto;
        display: block;
      }

      hr {
        border: none;
        border-top: 2px solid #eee;
        margin: 2rem 0;
      }
      ul,
      ol {
        padding: 0 1.5rem;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
