<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// import VueOfficeDocx from '@vue-office/docx'
// import '@vue-office/docx/lib/index.css'
import { renderAsync } from 'docx-preview'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import MyWorker from '@/utils/loadtxt.ts?worker'

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
    renderAsync(fileReader.result, divElement, undefined, {
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      experimental: false,
      trimXmlDeclaration: true,
      useBase64URL: false,
      useMathMLPolyfill: false,
      renderChanges: false,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      debug: false
    })
  }
}

// 渲染md
const renderMd = (md: File | undefined, renderContainer: HTMLElement) => {
  clearRenderDocx()
  clearRenderImage()
  const divElement = document.createElement('div')
  divElement.id = 'tempMd'
  renderContainer.appendChild(divElement)
  const reader = new FileReader()
  reader.readAsText(md!)
  reader.onload = () => {
    const markdown = reader.result
    const html = marked.parse(markdown as string)
    divElement.innerHTML = html
  }
}

// 渲染txt
const renderTxt = (txt: File | undefined, renderContainer: HTMLElement) => {
  clearRenderDocx()
  clearRenderImage()
  const divElement = document.createElement('div')
  divElement.id = 'tempTxt'
  renderContainer.appendChild(divElement)

  let domUpdateTimer: number | null
  let chunks: any[] = []
  const worker = new MyWorker()
  worker.onmessage = (msg: any) => {
    chunks.push(msg.data)
    if (!domUpdateTimer) {
      domUpdateTimer = setTimeout(() => {
        divElement.innerHTML += `<pre>${chunks.join('')}</pre>`
        chunks = []
        domUpdateTimer = null
      }, 200)
    }
  }
  worker.postMessage(txt)
}

// 移除渲染的docx、md、txt
const clearRenderDocx = () => {
  if (document.getElementById('tempDocx')) {
    filePreviewRef.value?.removeChild(document.getElementById('tempDocx')!)
  }
  if (document.getElementById('tempMd')) {
    filePreviewRef.value?.removeChild(document.getElementById('tempMd')!)
  }
  if (document.getElementById('tempTxt')) {
    filePreviewRef.value?.removeChild(document.getElementById('tempTxt')!)
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
    filePreviewRef.value?.removeChild(document.getElementById('tempImg')!)
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
      renderImage(newFile, filePreviewRef.value!)
    } else if (newFile.name.slice(-2) == 'md') {
      renderMd(newFile, filePreviewRef.value!)
    } else if (newFile.type == 'text/plain') {
      renderTxt(newFile, filePreviewRef.value!)
    } else {
      isShowExitButton.value = false
      console.log(newFile)
      ElMessage({
        duration: 2000,
        message: '此文档格式不支持！',
        type: 'warning'
      })
    }
  } else {
    // 删除文件夹操作,实际已删除,退出预览即可
    // 如果删除的文件夹不是正在预览的，不退出预览
    if (filesStore.deleteFolderId == filesStore.previewFolderId) {
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
    <!-- <div ref="imgPreviewRef"></div> -->
  </div>
</template>

<style lang="less" scoped>
.file-preview-container {
  width: 1100px;
  overflow-x: auto;
}

.file-preview-info {
  font-size: 16px;
  margin-bottom: 5px;
  display: flex;
  place-items: center;
}
// .fileStyle {
//   border: 1px solid #ccc;
//   padding: 10px;
// }

#tempTxt {
  white-space: pre-wrap;
}
</style>
