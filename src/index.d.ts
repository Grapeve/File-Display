declare interface Window {
  showDirectoryPicker: (options?: {
    id: string
    mode: string
    startIn: string | FileSystemHandle
  }) => Promise<FileSystemDirectoryHandle>
}
