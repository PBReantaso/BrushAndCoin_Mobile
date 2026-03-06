const subscribers: Map<string, Set<WritableStreamDefaultWriter<string>>> = new Map()

export function subscribe(conversationId: string, writer: WritableStreamDefaultWriter<string>) {
  if (!subscribers.has(conversationId)) subscribers.set(conversationId, new Set())
  subscribers.get(conversationId)!.add(writer)
}

export function unsubscribe(conversationId: string, writer: WritableStreamDefaultWriter<string>) {
  const set = subscribers.get(conversationId)
  if (!set) return
  set.delete(writer)
  if (set.size === 0) subscribers.delete(conversationId)
}

export async function publishEvent(conversationId: string, payload: any) {
  const set = subscribers.get(conversationId)
  if (!set) return
  const data = `data: ${JSON.stringify(payload)}\n\n`
  for (const writer of Array.from(set)) {
    try {
      await writer.write(data)
    } catch (err) {
      // if write fails, remove subscriber
      set.delete(writer)
    }
  }
}

export function createSSEStream(conversationId: string) {
  const stream = new ReadableStream<string>({
    start(controller) {
      // boxed writer that forwards into controller
      const boxedWriter = {
        write(chunk: string) {
          controller.enqueue(chunk)
          return Promise.resolve()
        },
      } as unknown as WritableStreamDefaultWriter<string>

      subscribe(conversationId, boxedWriter)
    },
    cancel() {
      // noop - subscribers are cleaned up on write errors
    },
  })

  return stream
}

export default null
