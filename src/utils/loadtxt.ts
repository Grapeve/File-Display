import { ElMessage } from 'element-plus'

const chunkSize = 150000

onmessage = (message) => {
  const txtFile = message.data
  // 读取文件
  const chunks: any[] = []

  function readChunk(pos: number) {
    const reader = new FileReader()
    reader.readAsText(txtFile.slice(pos, pos + chunkSize))
    pos += chunkSize
    reader.onload = () => {
      postMessage(reader.result)
      if (pos < txtFile.size) {
        readChunk(pos)
      } else {
        postMessage('done')
      }
    }
  }

  readChunk(0)
}
