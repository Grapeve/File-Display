<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// import VueOfficeDocx from '@vue-office/docx'
// import '@vue-office/docx/lib/index.css'
import { renderAsync } from 'docx-preview'
import { ElMessage } from 'element-plus'

import { useFilesStore } from '@/stores/files'
const filesStore = useFilesStore()

const props = defineProps({
  fileSelect: File
})

const filePreviewRef = ref<HTMLElement>() // 文件预览区域
const imgPreviewRef = ref<HTMLElement>() // 图片预览区域
const file = computed(() => {
  return props.fileSelect
})

// 渲染docx
const renderDocx = (file: File | undefined, renderContainer: HTMLElement) => {
  clearRenderDocx()
  clearRenderImage()
  const divElement = document.createElement('div')
  divElement.id = 'tempDocx'
  renderContainer.appendChild(divElement)
  let fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file as File)
  fileReader.onload = () => {
    renderAsync(fileReader.result, divElement)
  }
}
// 移除渲染的docx
const clearRenderDocx = () => {
  if (document.getElementById('tempDocx')) {
    filePreviewRef.value?.removeChild(document.getElementById('tempDocx')!)
  }
}

// TODO: 渲染 PDF
// TODO: 移除渲染的 PDF

// 渲染 image
const renderImage = (img: File | undefined, renderContainer: HTMLElement) => {
  clearRenderDocx()
  clearRenderImage()
  const tempImgUrl = URL.createObjectURL(img!)
  const imageElement = document.createElement('img')
  imageElement.src = tempImgUrl
  imageElement.id = 'tempImg'
  imageElement.style.width = '800px'
  renderContainer.appendChild(imageElement)
}
// 移除渲染的image
const clearRenderImage = () => {
  if (document.getElementById('tempImg')) {
    imgPreviewRef.value?.removeChild(document.getElementById('tempImg')!)
  }
}

const isShowExitButton = ref<boolean>(false)
watch(file, (newFile) => {
  if (newFile) {
    isShowExitButton.value = true
    clearRenderDocx()
    clearRenderImage()
    if (newFile.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      renderDocx(newFile, filePreviewRef.value!)
    } else if (newFile.type.includes('image')) {
      renderImage(newFile, imgPreviewRef.value!)
    } else {
      isShowExitButton.value = false
      ElMessage({
        duration: 2000,
        message: '此文档格式不支持！',
        type: 'warning'
      })
    }
  } else {
    // 删除文件夹操作,实际已删除,退出预览即可
    // 如果删除的文件夹不是正在预览的，不退出预览
    if (filesStore.deleteFolderId != filesStore.previewFolderId) {
      exitPreview()
    }
  }
})

// 退出预览
const exitPreview = () => {
  isShowExitButton.value = false
  clearRenderDocx()
  clearRenderImage()
}
</script>

<template>
  <div class="file-preview-container">
    <!-- <vue-office-docx :src="fileSrc" /> -->
    <!-- <div class="file-preview-info" v-if="isShowExitButton">
      <el-button type="primary" style="margin-right: 10px" @click="exitPreview">退出预览</el-button>
      <span>文件名：{{ fileSelect?.name }}</span>
    </div>
    <div ref="filePreviewRef" v-show="isShowUpdateLog"></div>
    <div ref="imgPreviewRef" v-show="!isShowUpdateLog"></div>
  </div> -->
    <div class="file-preview-info" v-if="isShowExitButton">
      <el-button type="primary" style="margin-right: 10px" @click="exitPreview">退出预览</el-button>
      <span>文件名：{{ fileSelect?.name }}</span>
    </div>
    <div ref="filePreviewRef"></div>
    <div ref="imgPreviewRef"></div>
  </div>
</template>

<style lang="less" scoped>
.file-preview-container {
  width: 900px;
  overflow-x: auto;
}

.file-preview-info {
  font-size: 16px;
  margin-bottom: 5px;
  display: flex;
  place-items: center;
}
</style>
