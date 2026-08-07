/** 选项条目（房间/时间/人物共用） */
export interface OptionItem {
  id: string
  name: string
  iconImage: string  // 列表展示用的小图（圆形选项）
}

/** 同一类型的资源映射表 */
export type CardImageMap = Record<string, string>

/** 案件的线索重叠图（跟随案件变化） */
export interface CaseCardImages {
  rooms: CardImageMap       // 房间重叠图，key为roomId
  times: CardImageMap       // 时间重叠图，key为timeId
  characters: CardImageMap  // 人物重叠图，key为characterId
}

/** 案件 */
export interface CaseInfo {
  id: string
  name: string // 如 "案件一"
  difficulty: number // 1-5，用星星表示
  setupImages: string[] // 初始设置图片列表（支持多张左右滑动）
  answerImage: string // 答案图片路径
  cardImages: CaseCardImages // 本案件专属的重叠展示图（同时决定可选范围）
}

/** 剧本 */
export interface Script {
  id: string
  name: string // 如 "名流毒杀案"
  cases: CaseInfo[]
}

/** 线索查询条件 */
export interface ClueQuery {
  scriptId: string
  caseId: string
  roomId: string
  targetId: string // timeId 或 characterId
  targetType: 'time' | 'character'
}
