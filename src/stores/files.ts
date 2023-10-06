import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFilesStore = defineStore('files', () => {
  const files = ref<File[]>()
  function addFile(file: File) {
    files.value?.push(file)
  }

  const fileTrees = ref<any[]>([])
  function deleteFileTree(id: number) {
    const index = fileTrees.value.findIndex((fileTree) => fileTree.id === id)
    fileTrees.value.splice(index, 1)
  }
  const previewFolderId = ref<Number>()
  const deleteFolderId = ref<Number>()

  return { files, addFile, fileTrees, deleteFileTree, previewFolderId, deleteFolderId }
})
