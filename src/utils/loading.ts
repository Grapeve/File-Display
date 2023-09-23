import { ElLoading } from 'element-plus'

let loading: any
function startLoading(targetRef: HTMLElement) {
  loading = ElLoading.service({
    lock: true,
    text: '拼命加载中!',
    background: 'rgba(0, 0, 0, 0)',
    target: targetRef,
    customClass: 'loading-container'
  })
}

async function endLoading() {
  loading.close()
}

export { startLoading, endLoading }
