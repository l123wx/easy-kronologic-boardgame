import type { OptionItem, Script } from '@/types'
import config from './game-config.json'

export const rooms: Record<string, OptionItem> = config.rooms
export const times: Record<string, OptionItem> = config.times
export const characters: Record<string, OptionItem> = config.characters
export const scripts: Script[] = config.scripts
export const rulesImages: string[] = config.rulesImages
export const answerSheetImage: string = config.answerSheetImage

/** 根据 ID 获取剧本 */
export function getScript(id: string): Script | undefined {
  return scripts.find(s => s.id === id)
}
