<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isHideUpdateLog = ref<boolean>(false)
const hideUpdateLog = () => {
  isHideUpdateLog.value = !isHideUpdateLog.value
}

onMounted(() => {
  setTimeout(() => {
    hideUpdateLog()
  }, 1500)
})
</script>

<template>
  <div
    v-if="!isHideUpdateLog"
    style="border: 1px solid #79bbff; border-radius: 6px; background-color: white"
  >
    <div class="notification">
      ✨ 更新公告
      <div class="circle" @click="hideUpdateLog">
        <el-icon style="color: #79bbff"><CloseBold /></el-icon>
      </div>
    </div>
    <div style="margin: 5px 2px">
      <el-scrollbar height="300px">
        <!-- 2023.10.06 v1.0.4 -->
        <div style="margin: 0 0 10px 10px">
          <span style="color: purple; font-weight: 700">2023.10.06 v1.0.4</span>
          <div>
            <span style="color: #8a2be2; font-weight: 600">新功能🆕:</span>
            <div>1. 支持Markdown和Txt文件预览。</div>
            <div>2. 5秒内流畅加载千万字txt文件。</div>
          </div>
          <div>
            <span style="color: rgb(135, 205, 231); font-weight: 600">后续更新:</span>
            <div>1. 支持预览PDF文件。</div>
          </div>
        </div>
        <!-- 2023.9.24 v1.0.3 -->
        <div style="margin: 0 0 10px 10px">
          <span style="color: purple; font-weight: 700">2023.9.24 v1.0.3</span>
          <div>
            <span style="color: rgb(123, 239, 139); font-weight: 600">修复bug🆕:</span>
            <div>1. 删除文件夹会导致正在预览不属于该文件夹的文件退出预览。</div>
          </div>
          <div>
            <span style="color: rgb(135, 205, 231); font-weight: 600">后续更新:</span>
            <div>1. 支持预览MD和PDF文件。</div>
          </div>
        </div>
        <!-- 2023.9.23 v1.0.2 -->
        <div style="margin: 0 0 10px 10px">
          <span style="color: purple; font-weight: 700">2023.9.23 v1.0.2</span>
          <div>
            <span style="color: #8a2be2; font-weight: 600">新增功能🆕:</span>
          </div>
          <div>1. 新增点击预览不支持的文件格式会有提示。</div>
          <div>2. 对于正在预览的文件新增退出预览功能。</div>
          <div>3. 不加载文件夹中的压缩包。</div>
        </div>
        <!-- 2023.9.22 v1.0.1 -->
        <div style="margin: 0 0 10px 10px">
          <span style="color: purple; font-weight: 700">2023.9.22 v1.0.1</span>
          <div>
            1.
            目录层级巨大的文件夹生成的目录结构树数据在渲染时整个页面会出现卡顿现象，后面考虑换虚拟树。
          </div>
          <div>2. 新增文件目录删除。</div>
          <div>后续更新：</div>
          <div>
            1. 优化生成树形控价数据方法。<el-icon style="color: blue"><Select /></el-icon>
          </div>
          <div>
            2.
            <span style="color: red">(bug)</span
            >删除文件夹会导致正在预览不属于该文件夹的文件退出预览。<el-icon style="color: blue"
              ><Select
            /></el-icon>
          </div>
        </div>
        <!-- 2023.9.21 v1.0.0 -->
        <div style="margin: 0 0 10px 10px">
          <span style="color: purple; font-weight: 700">2023.9.21 v1.0.0</span>
          <div>
            1. docx文件预览区，使用
            <span style="font-weight: 800">docx-preview</span>
            ，效果并不好。
          </div>
          <div>2. 暂时只支持docx预览。</div>
          <div>3. 上传后点击文件目录下的文件名进行预览。</div>
        </div>
        <!-- 2023.9.21 v1.0.0 -->
        <div style="margin: 0 0 10px 10px">
          <span style="color: purple; font-weight: 700">2023.9.21 v1.0.1</span>
          <div>1. 改用 showDirectoryPicker 获取目录</div>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <div v-else class="display" @click="isHideUpdateLog = !isHideUpdateLog">
    <el-icon style="color: #ffffff; font-size: 20px"><Flag /></el-icon>
  </div>
</template>

<style lang="less" scoped>
.notification {
  position: relative;
  background-color: #79bbff;
  border-radius: 4px;
  font-size: 14px;
  color: white;
  letter-spacing: 0.5px;
  padding: 6px 4px;
  display: flex;
  align-items: center;
  .circle {
    background-color: white;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    border: 1px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 10px;
  }
}
.display {
  position: relative;
  top: 0px;
  left: 315px;
  background-color: #79bbff;
  opacity: 0.5;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
