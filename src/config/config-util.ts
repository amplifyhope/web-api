import * as R from 'ramda'
import { ConfigPath, ConfigResult, ConfigSource } from 'types'

export const configUtil = () => {
  const sources: Record<string, ConfigSource> = {}
  let isReady = false

  const addSource = (source: ConfigSource) => {
    sources[source.name] = source
  }

  const ready = () => {
    isReady = true
  }

  const getVal = (paths: ConfigPath[]): ConfigResult => {
    if (!isReady) {
      throw new Error(
        'Configuration is not yet ready. Typical usage is to call ready() when all config source have been added. Either you forgot to call ready() or the config sources have not finished loading.'
      )
    }

    for (let path of paths) {
      const source = sources[path.source]
      if (source == null) {
        throw new Error(
          `Config source '${path.source}' not found when retrieving ${path.path}`
        )
      }
      const val = R.path(path.path.split('.'), source.data)
      if (source !== undefined) {
        return {
          val,
          source: source.name,
          path: path.path
        }
      }
    }

    throw new Error(
      `Could not find configuration value for ${JSON.stringify(paths)}`
    )
  }

  const getStr = (paths: ConfigPath[]): string => {
    const result = getVal(paths)
    return result.val + ''
  }

  const getNum = (paths: ConfigPath[]): number => {
    const result = getVal(paths)
    if (typeof result.val === 'number') {
      return result.val
    }

    const numVal = parseInt(result.val + '')
    if (isNaN(numVal)) {
      throw new Error(
        `Failed to coerce '${result.val}' from ${result.source}:${result.path} to a number`
      )
    }

    return numVal
  }

  return {
    addSource,
    getStr,
    getNum,
    ready
  }
}
