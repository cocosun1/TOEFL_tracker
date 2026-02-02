import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getPastDateKeys = (days) => {
  const today = new Date()
  const keys = []
  for (let i = 0; i < days; i += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    keys.push(formatDateKey(date))
  }
  return keys
}

const initialBuckets = [
  {
    id: 'exam-practice',
    name: 'Exam Practice',
    description: '',
    tasks: [
      { id: 'exam-1', title: 'Full mock + review', points: 60 },
      { id: 'exam-2', title: 'Reading 15 questions', points: 15 },
      { id: 'exam-3', title: 'Listening 15 questions', points: 15 },
      { id: 'exam-4', title: 'Writing 3 tasks', points: 15 },
      { id: 'exam-5', title: 'Speaking 6 tasks', points: 15 },
      { id: 'exam-6', title: 'Memorize 50 words', points: 15 },
    ],
  },
  {
    id: 'daily-immersion',
    name: 'Everyday Immersion',
    description: '',
    tasks: [
      { id: 'daily-1', title: 'Sit in on a lecture', points: 20 },
      { id: 'daily-4', title: 'English speaking meetup', points: 20 },
      { id: 'daily-5', title: 'ESOL class', points: 20 },
      { id: 'daily-2', title: 'Join a lunch activity', points: 15 },
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment Boost',
    description: '',
    tasks: [
      { id: 'fun-1', title: 'Watch one episode of a US TV show', points: 10 },
      { id: 'fun-2', title: 'Duolingo session', points: 10 },
      { id: 'fun-3', title: 'Learn English lyrics', points: 10 },
      { id: 'fun-4', title: 'Take a dance class', points: 10 },
    ],
  },
]

const initialSelections = {}

const bucketTranslations = {
  'exam-practice': {
    name: { en: 'Exam Practice', zh: '应试练习' },
    description: { en: '', zh: '' },
    tasks: {
      'exam-1': { en: 'Full mock + review', zh: '完整模考 + 复盘' },
      'exam-2': { en: 'Reading 15 questions', zh: '阅读 15 题' },
      'exam-3': { en: 'Listening 15 questions', zh: '听力 15 题' },
      'exam-4': { en: 'Writing 3 tasks', zh: '写作 3 题' },
      'exam-5': { en: 'Speaking 6 tasks', zh: '口语 6 题' },
      'exam-6': { en: 'Memorize 50 words', zh: '背单词 50 个' },
    },
  },
  'daily-immersion': {
    name: { en: 'Everyday Immersion', zh: '生活化沉淀' },
    description: { en: '', zh: '' },
    tasks: {
      'daily-1': { en: 'Sit in on a lecture', zh: '旁听讲座' },
      'daily-4': { en: 'English speaking meetup', zh: '英语交流会' },
      'daily-5': { en: 'ESOL class', zh: 'ESOL 课程' },
      'daily-2': { en: 'Join a lunch activity', zh: '参加午餐活动' },
    },
  },
  entertainment: {
    name: { en: 'Entertainment Boost', zh: '娱乐加强' },
    description: { en: '', zh: '' },
    tasks: {
      'fun-1': { en: 'Watch one episode of a US TV show', zh: '观看美剧一集' },
      'fun-2': { en: 'Duolingo session', zh: '多邻国' },
      'fun-3': { en: 'Learn English lyrics', zh: '学英语歌词' },
      'fun-4': { en: 'Take a dance class', zh: '上跳舞课' },
    },
  },
}

const greetingTemplates = {
  en: [
    'Ready to tackle this, {name}?',
    "Let's make progress today, {name}.",
    "Feeling focused, {name}? Let's go.",
    'Time to level up, {name}!',
    'Show up for yourself today, {name}.',
  ],
  zh: [
    '准备好开始了吗，{name}？',
    '{name}，今天一起进步吧。',
    '{name}，专注起来，我们开始。',
    '{name}，是时候升级了！',
    '{name}，今天也要好好努力。',
  ],
}

const dailyTips = {
  en: [
    '语法小贴士：用 “however” 来表达转折（例：However, the result was different.）。',
    '语法小贴士：使用并列结构让列表更清晰（例：I value clarity, speed, and accuracy.）。',
    '句式结构：先写主题句，再补充 2 条支持细节（例：Online learning is effective. First..., Second...）。',
    '句式结构：用 “cause → effect” 解释结果（例：Because..., it leads to...）。',
    '语法小贴士：长短句结合让表达更顺畅（例：I tried. It worked.）。',
    '句式结构：利用 “on the other hand” 来制造对比（例：On the other hand, the cost is high.）。',
  ],
  zh: [
    '语法小贴士：用 “however” 连接转折观点（例：However, the result was different.）。',
    '语法小贴士：并列结构让表达更清晰（例：I value clarity, speed, and accuracy.）。',
    '句型结构：先写主题句，再给两条支持细节（例：Online learning is effective. First..., Second...）。',
    '句型结构：用“原因→结果”结构解释结论（例：Because..., it leads to...）。',
    '语法小贴士：长短句结合提升节奏感（例：I tried. It worked.）。',
    '句型结构：使用对比表达，如 “on the other hand”（例：On the other hand, the cost is high.）。',
  ],
}

const translations = {
  en: {
    eyebrow: 'TOEFL Progress Planner',
    tipLabel: 'Tip of the day',
    greetingFallback: 'Ready to tackle this today?',
    today: 'Today',
    bucketsPicked: 'Buckets picked',
    dailyGoal: 'Daily goal',
    points: 'points',
    pointsPerDayLabel: 'Points per day',
    pointsHint: '8 hours = 100 points',
    planningBoard: 'Planning board',
    todaysTodos: "Today's todos",
    selectPrompt: 'Please select your focus tasks for each bucket.',
    chooseTask: "Choose today's tasks",
    clear: 'Clear',
    addTask: 'Add task',
    addTaskPlaceholder: 'Add a custom task...',
    yourTodos: 'Your todos for today',
    todoSubtitle: 'Work through the picks you made for each TOEFL bucket.',
    backToBoard: 'Back to board',
    buildListPrompt:
      "Pick tasks from your focused buckets to build today's list.",
    goToBoard: 'Go to planning board',
    analyticsTitle: 'Progress analytics',
    analyticsSubtitle:
      'Look back at how consistently you practiced across buckets.',
    totalSelections: 'Total selections',
    averagePerDay: 'Average per day',
    bucketsFocused: 'Buckets focused',
    atLeastOnce: 'At least once this range',
    bucketTotals: 'Bucket totals',
    recentPicks: 'Recent picks',
    noSelections: 'No selections',
    activeDays: 'active day',
    activeDaysPlural: 'active days',
    focusSettingsTitle: 'Welcome! Tell us your focus and goals.',
    focusSettingsSubtitle:
      'Enter your name, choose buckets, and set a daily points goal.',
    settingsSubtitle: 'Update your name, focus, and language preferences.',
    unknownTask: 'Unknown task',
    settingsTitle: 'Update your profile and goals',
    nameLabel: 'Your name',
    focusBucketsLabel: 'Focus buckets',
    focusBucketsLabel: 'Which of these would you like to work on?',
    taskCategoriesLabel: 'Categories',
    save: 'Save changes',
    continue: 'Continue',
    languageLabel: 'Language',
    english: 'English',
    chinese: '中文',
    notInFocus: 'Not in focus',
    analytics: 'Analytics',
    settings: 'Settings',
    selected: 'Selected',
    open: 'Open',
    acrossAllBuckets: 'Across all buckets',
    inThisRange: 'in this range',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    manage: 'Manage',
    manageTasks: 'Manage tasks',
    deleteTask: 'Delete',
    streaks: 'Streaks',
    totalDays: 'Total days',
    days: 'days',
    submitChoices: 'Submit choices',
    undo: 'Undo',
    resetProfile: 'Reset profile',
  },
  zh: {
    eyebrow: '托福进度规划',
    tipLabel: '今日小贴士',
    greetingFallback: '准备好开始今天的练习了吗？',
    today: '今天',
    bucketsPicked: '已选模块',
    dailyGoal: '每日目标',
    points: '分',
    pointsPerDayLabel: '每日目标分数',
    pointsHint: '8 小时 = 100 分',
    planningBoard: '计划看板',
    todaysTodos: '今日任务',
    selectPrompt: '请为每个模块选择你今天的专注任务。',
    chooseTask: '选择今天的任务',
    clear: '清空',
    addTask: '添加任务',
    addTaskPlaceholder: '添加自定义任务...',
    yourTodos: '今日任务清单',
    todoSubtitle: '完成你在各模块选出的练习任务。',
    backToBoard: '返回看板',
    buildListPrompt: '从你的专注模块中选择任务来生成今日清单。',
    goToBoard: '进入计划看板',
    analyticsTitle: '进度分析',
    analyticsSubtitle: '回顾你在各模块的练习频率与趋势。',
    totalSelections: '总选择次数',
    averagePerDay: '每日平均',
    bucketsFocused: '已专注模块',
    atLeastOnce: '该周期内至少一次',
    bucketTotals: '模块统计',
    recentPicks: '最近选择',
    noSelections: '暂无选择',
    activeDays: '活跃天数',
    activeDaysPlural: '活跃天数',
    focusSettingsTitle: '欢迎！请设置你的专注目标。',
    focusSettingsSubtitle: '填写姓名，选择模块，并设置每日目标分数。',
    settingsSubtitle: '更新你的姓名、专注目标与语言偏好。',
    unknownTask: '未知任务',
    settingsTitle: '更新你的个人信息与目标',
    nameLabel: '你的名字',
    focusBucketsLabel: '专注模块',
    focusBucketsLabel: '你想重点练习哪些模块？',
    taskCategoriesLabel: '分类',
    save: '保存',
    continue: '继续',
    languageLabel: '语言',
    english: 'English',
    chinese: '中文',
    notInFocus: '未专注',
    analytics: '分析',
    settings: '设置',
    selected: '已选择',
    open: '待选择',
    acrossAllBuckets: '跨所有模块',
    inThisRange: '在该周期内',
    last7Days: '最近7天',
    last30Days: '最近30天',
    manage: '管理',
    manageTasks: '管理任务',
    deleteTask: '删除',
    streaks: '连续天数',
    totalDays: '累计天数',
    days: '天',
    submitChoices: '提交选择',
    undo: '撤销',
    resetProfile: '重置资料',
  },
}

const analyticsRanges = [
  { id: 'week', days: 7 },
  { id: 'month', days: 30 },
]

function App() {
  const [buckets, setBuckets] = useState(initialBuckets)
  const [dailySelections, setDailySelections] = useState(initialSelections)
  const [dailyCompletions, setDailyCompletions] = useState({})
  const [newTaskTitles, setNewTaskTitles] = useState({})
  const [rangeId, setRangeId] = useState('week')
  const [activeView, setActiveView] = useState('planner')
  const [userName, setUserName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [language, setLanguage] = useState('zh')
  const [focusBuckets, setFocusBuckets] = useState([])
  const [dailyPointGoal, setDailyPointGoal] = useState(100)
  const [showSettings, setShowSettings] = useState(false)
  const [manageBucketId, setManageBucketId] = useState(null)
  const [emojiRainLocal, setEmojiRainLocal] = useState([])
  const [emojiRainGlobal, setEmojiRainGlobal] = useState([])
  const emojiTimeoutRef = useRef({ local: null, global: null })
  const [formName, setFormName] = useState('')
  const [formLanguage, setFormLanguage] = useState('zh')
  const [formFocusBuckets, setFormFocusBuckets] = useState([])
  const [formDailyPointGoal, setFormDailyPointGoal] = useState(100)

  const todayKey = formatDateKey(new Date())
  const todaySelections = dailySelections[todayKey] || {}
  const todayCompletions = dailyCompletions[todayKey] || {}
  const focusedBucketIds =
    focusBuckets.length > 0 ? focusBuckets : buckets.map((bucket) => bucket.id)
  const focusedBucketsList = buckets.filter((bucket) =>
    focusedBucketIds.includes(bucket.id)
  )
  const t = (key) =>
    translations[language]?.[key] || translations.en[key] || key
  const getBucketName = (bucketId) =>
    bucketTranslations[bucketId]?.name?.[language] ||
    bucketTranslations[bucketId]?.name?.en ||
    buckets.find((bucket) => bucket.id === bucketId)?.name ||
    bucketId
  const getBucketDescription = (bucketId) =>
    bucketTranslations[bucketId]?.description?.[language] ||
    bucketTranslations[bucketId]?.description?.en ||
    buckets.find((bucket) => bucket.id === bucketId)?.description ||
    ''
  const getDailyTip = () => {
    const tips = dailyTips.en
    const dayKey = formatDateKey(new Date())
    let hash = 0
    for (let i = 0; i < dayKey.length; i += 1) {
      hash = (hash + dayKey.charCodeAt(i) * (i + 1)) % tips.length
    }
    return tips[hash]
  }
  const getTaskPoints = (bucketId, taskId) => {
    const bucket = buckets.find((item) => item.id === bucketId)
    const task = bucket?.tasks.find((item) => item.id === taskId)
    return task?.points ?? 10
  }
  const getTotalPointsForSelections = (selections) =>
    Object.entries(selections).reduce((sum, [bucketId, tasks]) => {
      return (
        sum +
        (tasks || []).reduce(
          (taskSum, taskId) => taskSum + getTaskPoints(bucketId, taskId),
          0
        )
      )
    }, 0)
  const getTotalPointsForCompletions = (completions) =>
    Object.entries(completions).reduce((sum, [bucketId, tasks]) => {
      const taskPoints = Object.entries(tasks || {}).reduce(
        (taskSum, [taskId, done]) =>
          done ? taskSum + getTaskPoints(bucketId, taskId) : taskSum,
        0
      )
      return sum + taskPoints
    }, 0)
  const selectedPointsToday = getTotalPointsForSelections(todaySelections)
  const completedPointsToday = getTotalPointsForCompletions(todayCompletions)
  const isGoalSelected = selectedPointsToday >= dailyPointGoal
  const selectedTaskCount = Object.values(todaySelections).reduce(
    (sum, tasks) => sum + (tasks || []).length,
    0
  )
  const isOnboarding = !userName
  const isSettingsOpen = showSettings || isOnboarding
  const isSettingsMode = showSettings && !isOnboarding
  const activeManageBucket = buckets.find(
    (bucket) => bucket.id === manageBucketId
  )
  const todayViewRef = useRef(null)


  useEffect(() => {
    const storedName = window.localStorage.getItem('toeflUserName') || ''
    const storedLanguage = window.localStorage.getItem('toeflLanguage') || 'zh'
    const storedGoals = window.localStorage.getItem('toeflGoals')
    if (storedName) {
      setUserName(storedName)
    }
    setLanguage(storedLanguage)
    if (storedGoals) {
      const parsed = JSON.parse(storedGoals)
      const validBucketIds = initialBuckets.map((bucket) => bucket.id)
      const filteredFocus = (parsed.focusBuckets || []).filter((id) =>
        validBucketIds.includes(id)
      )
      const nextGoal =
        typeof parsed.dailyPointGoal === 'number' && parsed.dailyPointGoal > 0
          ? parsed.dailyPointGoal
          : 100
      setFocusBuckets(filteredFocus.length > 0 ? filteredFocus : validBucketIds)
      setDailyPointGoal(nextGoal)
    }
  }, [])

  useEffect(() => {
    if (!userName) {
      setGreeting('')
      return
    }
    const options =
      greetingTemplates[language] || greetingTemplates.en || []
    const template = options[Math.floor(Math.random() * options.length)]
    setGreeting(template.replace('{name}', userName))
  }, [userName, language])

  useEffect(() => {
    if (!isOnboarding || showSettings) {
      return
    }
    const defaultFocus = buckets.map((bucket) => bucket.id)
    setFormName(userName)
    setFormLanguage(language)
    setFormFocusBuckets(defaultFocus)
    setFormDailyPointGoal(dailyPointGoal)
  }, [buckets, dailyPointGoal, isOnboarding, language, showSettings, userName])

  const analytics = useMemo(() => {
    const range = analyticsRanges.find((item) => item.id === rangeId)
    const dateKeys = getPastDateKeys(range.days)
    const bucketTotals = buckets.reduce((acc, bucket) => {
      acc[bucket.id] = 0
      return acc
    }, {})
    let totalSelections = 0
    let activeDays = 0

    const timeline = dateKeys.map((key) => {
      const selections = dailySelections[key] || {}
      const selectionEntries = Object.entries(selections)
      const dayCount = selectionEntries.reduce(
        (sum, [, tasks]) => sum + (tasks || []).length,
        0
      )
      if (dayCount > 0) {
        activeDays += 1
      }
      selectionEntries.forEach(([bucketId, tasks]) => {
        if (bucketTotals[bucketId] !== undefined) {
          bucketTotals[bucketId] += (tasks || []).length
        }
      })
      totalSelections += dayCount
      return { key, selections }
    })

    return { range, dateKeys, bucketTotals, totalSelections, activeDays, timeline }
  }, [buckets, dailySelections, rangeId])

  const getBucketCompletionMap = (completions, bucketId) =>
    completions?.[bucketId] || {}

  const isDayCompleted = (dateKey) => {
    const completions = dailyCompletions[dateKey] || {}
    return isDayCompletedFor(completions)
  }

  const isDayCompletedFor = (completions) =>
    getTotalPointsForCompletions(completions) >= dailyPointGoal

  const streakCount = useMemo(() => {
    const dateKeys = getPastDateKeys(365)
    let count = 0
    for (const key of dateKeys) {
      if (isDayCompleted(key)) {
        count += 1
      } else {
        break
      }
    }
    return count
  }, [dailySelections, dailyCompletions, dailyPointGoal])

  const totalCompletedDays = useMemo(() => {
    const dateKeys = new Set([
      ...Object.keys(dailySelections),
      ...Object.keys(dailyCompletions),
    ])
    let count = 0
    dateKeys.forEach((key) => {
      if (isDayCompleted(key)) {
        count += 1
      }
    })
    return count
  }, [dailySelections, dailyCompletions, dailyPointGoal])

  const updateFocusedModules = (bucketIds) => {
    setFocusBuckets(bucketIds)
    setDailySelections((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((dateKey) => {
        const selectionsForDay = next[dateKey] || {}
        const filtered = Object.entries(selectionsForDay).reduce(
          (acc, [bucketId, tasks]) => {
            if (bucketIds.includes(bucketId)) {
              acc[bucketId] = tasks
            }
            return acc
          },
          {}
        )
        if (Object.keys(filtered).length > 0) {
          next[dateKey] = filtered
        } else {
          delete next[dateKey]
        }
      })
      return next
    })
    setDailyCompletions((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((dateKey) => {
        const completionsForDay = next[dateKey] || {}
        const filtered = Object.entries(completionsForDay).reduce(
          (acc, [bucketId, tasks]) => {
            if (bucketIds.includes(bucketId)) {
              acc[bucketId] = tasks
            }
            return acc
          },
          {}
        )
        if (Object.keys(filtered).length > 0) {
          next[dateKey] = filtered
        } else {
          delete next[dateKey]
        }
      })
      return next
    })
  }

  const updateSelectionForBucket = (bucketId, nextList) => {
    setDailySelections((prev) => {
      const nextForDay = { ...(prev[todayKey] || {}) }
      if (nextList.length === 0) {
        delete nextForDay[bucketId]
      } else {
        nextForDay[bucketId] = nextList
      }
      if (Object.keys(nextForDay).length === 0) {
        const { [todayKey]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [todayKey]: nextForDay }
    })
    setDailyCompletions((prev) => {
      const nextForDay = { ...(prev[todayKey] || {}) }
      if (nextList.length === 0) {
        delete nextForDay[bucketId]
      } else {
        const previousBucket = getBucketCompletionMap(nextForDay, bucketId)
        const nextBucket = nextList.reduce((acc, taskId) => {
          acc[taskId] = previousBucket[taskId] || false
          return acc
        }, {})
        nextForDay[bucketId] = nextBucket
      }
      if (Object.keys(nextForDay).length === 0) {
        const { [todayKey]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [todayKey]: nextForDay }
    })
  }

  const handleSelectionToggle = (bucketId, taskId) => {
    const currentList = todaySelections[bucketId] || []
    if (currentList.includes(taskId)) {
      const nextList = currentList.filter((id) => id !== taskId)
      updateSelectionForBucket(bucketId, nextList)
      return
    }
    updateSelectionForBucket(bucketId, [...currentList, taskId])
  }

  const handleClearSelection = (bucketId) => {
    updateSelectionForBucket(bucketId, [])
  }

  const handleAddTask = (bucketId) => {
    const title = (newTaskTitles[bucketId] || '').trim()
    if (!title) {
      return
    }
    setBuckets((prev) =>
      prev.map((bucket) =>
        bucket.id === bucketId
          ? {
              ...bucket,
              tasks: [
                ...bucket.tasks,
                { id: `${bucketId}-${Date.now()}`, title, points: 10 },
              ],
            }
          : bucket
      )
    )
    setNewTaskTitles((prev) => ({ ...prev, [bucketId]: '' }))
  }

  const getTaskTitle = (bucketId, taskId) => {
    const translated =
      bucketTranslations[bucketId]?.tasks?.[taskId]?.[language] ||
      bucketTranslations[bucketId]?.tasks?.[taskId]?.en
    if (translated) {
      return translated
    }
    const bucket = buckets.find((item) => item.id === bucketId)
    const task = bucket?.tasks.find((item) => item.id === taskId)
    return task ? task.title : t('unknownTask')
  }

  const handleToggleCompletion = (event, bucketId, taskId) => {
    setDailyCompletions((prev) => {
      const prevBucket = getBucketCompletionMap(prev[todayKey], bucketId)
      const alreadyDone = !!prevBucket[taskId]
      if (alreadyDone) {
        return prev
      }
      const nextValue = true
      const nextForDay = {
        ...(prev[todayKey] || {}),
        [bucketId]: {
          ...prevBucket,
          [taskId]: nextValue,
        },
      }
      const prevComplete = isDayCompletedFor(prev[todayKey] || {})
      const nextComplete = isDayCompletedFor(nextForDay)
      if (nextValue) {
        triggerEmojiRain('local', event?.currentTarget)
      }
      if (!prevComplete && nextComplete) {
        triggerEmojiRain('global')
      }
      return {
        ...prev,
        [todayKey]: {
          ...nextForDay,
        },
      }
    })
  }

  const handleUndoCompletion = (bucketId, taskId) => {
    setDailyCompletions((prev) => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || {}),
        [bucketId]: {
          ...(prev[todayKey]?.[bucketId] || {}),
          [taskId]: false,
        },
      },
    }))
  }

  const triggerEmojiRain = (scope, target) => {
    const options = ['🎉', '✨', '🎯', '✅', '🌟', '👏', '🥳']
    const isGlobal = scope === 'global'
    const count = isGlobal ? 64 : 12
    const container = todayViewRef.current
    let centerPercent = 50
    let topStart = 0
    let fallDistance = isGlobal ? '120vh' : '120vh'
    const emoji =
      options[Math.floor(Math.random() * options.length)]
    if (scope === 'local' && container && target) {
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const center =
        (targetRect.left - containerRect.left + targetRect.width / 2) /
        containerRect.width
      centerPercent = Math.min(Math.max(center * 100, 10), 90)
      topStart = -20
    }
    if (scope === 'global') {
      topStart = -20
    }
    const drops = Array.from({ length: count }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      emoji: isGlobal
        ? options[Math.floor(Math.random() * options.length)]
        : emoji,
      left:
        isGlobal
          ? Math.random() * 100
          : Math.min(
              Math.max(centerPercent + (Math.random() * 24 - 12), 0),
              100
            ),
      top: topStart,
      fallDistance,
      delay: Math.random() * 0.2,
      duration: scope === 'global' ? 2.2 + Math.random() : 1.4 + Math.random(),
      size: 16 + Math.random() * 18,
    }))
    if (scope === 'global') {
      if (emojiTimeoutRef.current.global) {
        window.clearTimeout(emojiTimeoutRef.current.global)
      }
      setEmojiRainGlobal(drops)
      emojiTimeoutRef.current.global = window.setTimeout(
        () => setEmojiRainGlobal([]),
        2600
      )
      return
    }
    if (emojiTimeoutRef.current.local) {
      window.clearTimeout(emojiTimeoutRef.current.local)
    }
    setEmojiRainLocal(drops)
    emojiTimeoutRef.current.local = window.setTimeout(
      () => setEmojiRainLocal([]),
      2000
    )
  }

  const openSettingsPanel = () => {
    setFormName(userName)
    setFormLanguage(language)
    const defaultFocus =
      focusBuckets.length > 0
        ? focusBuckets
        : buckets.map((bucket) => bucket.id)
    setFormFocusBuckets(defaultFocus)
    setFormDailyPointGoal(dailyPointGoal)
    setShowSettings(true)
  }

  const handleSettingsSubmit = (event) => {
    event.preventDefault()
    const cleanedName = formName.trim()
    const goalValue = Number(formDailyPointGoal)
    if (!cleanedName || goalValue <= 0) {
      return
    }
    const normalizedGoal = Math.round(goalValue)
    setUserName(cleanedName)
    setLanguage(formLanguage)
    updateFocusedModules(formFocusBuckets)
    setDailyPointGoal(normalizedGoal)
    window.localStorage.setItem('toeflUserName', cleanedName)
    window.localStorage.setItem('toeflLanguage', formLanguage)
    window.localStorage.setItem(
      'toeflGoals',
      JSON.stringify({
        focusBuckets: formFocusBuckets,
        dailyPointGoal: normalizedGoal,
      })
    )
    setShowSettings(false)
  }

  const handleResetProfile = () => {
    window.localStorage.removeItem('toeflUserName')
    window.localStorage.removeItem('toeflGoals')
    setUserName('')
    setFocusBuckets([])
    setDailyPointGoal(100)
    setShowSettings(false)
  }

  const handleOpenManage = (bucketId) => {
    setManageBucketId(bucketId)
  }

  const handleCloseManage = () => {
    setManageBucketId(null)
  }

  const moveTask = (bucketId, fromIndex, toIndex) => {
    setBuckets((prev) =>
      prev.map((bucket) => {
        if (bucket.id !== bucketId) {
          return bucket
        }
        const nextTasks = [...bucket.tasks]
        const [moved] = nextTasks.splice(fromIndex, 1)
        nextTasks.splice(toIndex, 0, moved)
        return { ...bucket, tasks: nextTasks }
      })
    )
  }

  const handleDeleteTask = (bucketId, taskId) => {
    setBuckets((prev) =>
      prev.map((bucket) => {
        if (bucket.id !== bucketId) {
          return bucket
        }
        return {
          ...bucket,
          tasks: bucket.tasks.filter((task) => task.id !== taskId),
        }
      })
    )
    updateSelectionForBucket(
      bucketId,
      (todaySelections[bucketId] || []).filter((id) => id !== taskId)
    )
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1>{greeting || t('greetingFallback')}</h1>
          <div className="tip-card">
            <p className="label">{t('tipLabel')}</p>
            <p className="tip-text">{getDailyTip()}</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="analytics-icon"
            onClick={() => setActiveView('analytics')}
            aria-label={t('analytics')}
            title={t('analytics')}
          >
            <span aria-hidden="true">📊</span>
          </button>
          <button
            type="button"
            className="settings-icon"
            onClick={openSettingsPanel}
            aria-label={t('settings')}
            title={t('settings')}
          >
            <span aria-hidden="true">⚙️</span>
          </button>
        </div>
        <div className="today-card">
          <div>
            <p className="label">{t('today')}</p>
            <p className="value">{todayKey}</p>
          </div>
          <div>
            <p className="label">{t('streaks')}</p>
            <p className="value">
              {streakCount} {t('days')}
            </p>
          </div>
          <div>
            <p className="label">{t('totalDays')}</p>
            <p className="value">
              {totalCompletedDays} {t('days')}
            </p>
          </div>
      <div>
            <p className="label">{t('dailyGoal')}</p>
            <p className="value">
              {dailyPointGoal} {t('points')}
            </p>
          </div>
      </div>
      </header>

      <nav className="view-tabs">
        <button
          type="button"
          className={activeView === 'planner' ? 'active' : ''}
          onClick={() => setActiveView('planner')}
        >
          {t('planningBoard')}
        </button>
        <button
          type="button"
          className={activeView === 'today' ? 'active' : ''}
          onClick={() => setActiveView('today')}
        >
          {t('todaysTodos')}
        </button>
      </nav>

      {activeView === 'planner' && (
        <section className="planner">
          <div className="points-float" aria-live="polite">
            <p className="label">{t('pointsPerDayLabel')}</p>
            <p className="value">
              {selectedPointsToday} / {dailyPointGoal} {t('points')}
            </p>
          </div>
          <div className="planner-prompt">{t('selectPrompt')}</div>
          <div className="bucket-grid">
            {focusedBucketsList.map((bucket) => (
              <article
                key={bucket.id}
                className={`bucket-card ${
                  (todaySelections[bucket.id] || []).length > 0
                    ? 'selected'
                    : ''
                }`}
              >
              <div className="bucket-header">
                <div>
                  <h2>{getBucketName(bucket.id)}</h2>
                </div>
                  <div className="bucket-actions-header">
                    <button
                      type="button"
                      className="manage-icon"
                      onClick={() => handleOpenManage(bucket.id)}
                      aria-label={`${getBucketName(bucket.id)} ${t('manage')}`}
                      title={`${getBucketName(bucket.id)} ${t('manage')}`}
                    >
                      <span aria-hidden="true">⋯</span>
                    </button>
                    <span className="badge">
                      {(todaySelections[bucket.id] || []).length > 0
                        ? t('selected')
                        : t('open')}
                    </span>
                  </div>
              </div>

              <div className="bucket-body">
                  <p className="select-label">{t('chooseTask')}</p>
                <div className="task-board">
                  {bucket.tasks.map((task) => {
                      const isSelected = (
                        todaySelections[bucket.id] || []
                      ).includes(task.id)
                    return (
                      <label
                        key={task.id}
                        className={`task-card ${isSelected ? 'selected' : ''}`}
                      >
                        <input
                            type="checkbox"
                          name={`${bucket.id}-task`}
                          checked={isSelected}
                          onChange={() =>
                              handleSelectionToggle(bucket.id, task.id)
                          }
                        />
                        <span>{getTaskTitle(bucket.id, task.id)}</span>
                        <span className="task-points">
                          {getTaskPoints(bucket.id, task.id)} {t('points')}
                        </span>
                      </label>
                    )
                  })}
                </div>

              </div>

              <div className="bucket-footer">
                <div className="add-task-field">
                  <input
                    type="text"
                    placeholder={t('addTaskPlaceholder')}
                    value={newTaskTitles[bucket.id] || ''}
                    onChange={(event) =>
                      setNewTaskTitles((prev) => ({
                        ...prev,
                        [bucket.id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="add-task-btn"
                    onClick={() => handleAddTask(bucket.id)}
                    aria-label={t('addTask')}
                    title={t('addTask')}
                    disabled={!newTaskTitles[bucket.id]?.trim()}
                  >
                    ✓
                  </button>
                </div>
              </div>
            </article>
            ))}
          </div>
          <button
            type="button"
            className="primary submit-board"
            onClick={() => setActiveView('today')}
            disabled={!isGoalSelected}
          >
            {t('submitChoices')}
          </button>
        </section>
      )}

      {activeView === 'today' && (
        <section className="today-view" ref={todayViewRef}>
          {emojiRainLocal.length > 0 && (
            <div className="emoji-rain" aria-hidden="true">
              {emojiRainLocal.map((drop) => (
                <span
                  key={drop.id}
                  style={{
                    left: `${drop.left}%`,
                    top: `${drop.top}px`,
                    animationDelay: `${drop.delay}s`,
                    animationDuration: `${drop.duration}s`,
                    fontSize: `${drop.size}px`,
                    '--fall-distance': drop.fallDistance,
                  }}
                >
                  {drop.emoji}
                </span>
              ))}
            </div>
          )}
          <div className="today-header">
            <div>
              <h2>{t('yourTodos')}</h2>
              <p className="subhead">{t('todoSubtitle')}</p>
            </div>
            <button
              type="button"
              className="secondary"
              onClick={() => setActiveView('planner')}
            >
              {t('backToBoard')}
            </button>
          </div>

          {selectedTaskCount > 0 ? (
            <ul className="todo-list">
              {focusedBucketsList.flatMap((bucket) =>
                (todaySelections[bucket.id] || []).map((taskId) => {
                  const bucketCompletions = getBucketCompletionMap(
                    todayCompletions,
                    bucket.id
                  )
                  const isDone = !!bucketCompletions[taskId]
                  return (
                    <li key={`${bucket.id}-${taskId}`} className="todo-item">
                      <div
                        className={`todo-card ${isDone ? 'done' : ''}`}
                        onClick={(event) =>
                          handleToggleCompletion(event, bucket.id, taskId)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            handleToggleCompletion(event, bucket.id, taskId)
                          }
                        }}
                      >
                        <div>
                          <p className="todo-title">
                            {getBucketName(bucket.id)}
                          </p>
                          <p className="todo-task">
                            {getTaskTitle(bucket.id, taskId)}
                          </p>
                        </div>
                        {isDone && (
                          <button
                            type="button"
                            className="undo-btn"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleUndoCompletion(bucket.id, taskId)
                            }}
                          >
                            {t('undo')}
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          ) : (
            <div className="empty-state">
              <p>{t('buildListPrompt')}</p>
              <button
                type="button"
                className="primary"
                onClick={() => setActiveView('planner')}
              >
                {t('goToBoard')}
              </button>
            </div>
          )}
        </section>
      )}
      {emojiRainGlobal.length > 0 && (
        <div className="emoji-rain global" aria-hidden="true">
          {emojiRainGlobal.map((drop) => (
            <span
              key={drop.id}
              style={{
                left: `${drop.left}%`,
                top: `${drop.top}px`,
                animationDelay: `${drop.delay}s`,
                animationDuration: `${drop.duration}s`,
                fontSize: `${drop.size}px`,
                '--fall-distance': drop.fallDistance,
              }}
            >
              {drop.emoji}
            </span>
          ))}
        </div>
      )}

      {activeView === 'analytics' && (
        <section className="analytics">
          <button
            type="button"
            className="modal-close"
            onClick={() => setActiveView('planner')}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
          <div className="analytics-header">
            <div>
              <h2>{t('analyticsTitle')}</h2>
              <p className="subhead">{t('analyticsSubtitle')}</p>
            </div>
            <div className="segmented">
              {analyticsRanges.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  className={rangeId === range.id ? 'active' : ''}
                  onClick={() => setRangeId(range.id)}
                >
                  {range.id === 'week' ? t('last7Days') : t('last30Days')}
                </button>
              ))}
            </div>
          </div>

          <div className="analytics-grid">
            <div className="metric-card">
              <p className="label">{t('totalSelections')}</p>
              <p className="value">{analytics.totalSelections}</p>
              <p className="hint">
                {analytics.activeDays}{' '}
                {analytics.activeDays === 1
                  ? t('activeDays')
                  : t('activeDaysPlural')}{' '}
                {t('inThisRange')}
              </p>
            </div>
            <div className="metric-card">
              <p className="label">{t('averagePerDay')}</p>
              <p className="value">
                {analytics.range.days
                  ? (analytics.totalSelections / analytics.range.days).toFixed(1)
                  : '0.0'}
              </p>
              <p className="hint">{t('acrossAllBuckets')}</p>
            </div>
            <div className="metric-card">
              <p className="label">{t('bucketsFocused')}</p>
              <p className="value">
                {
                  buckets.filter(
                    (bucket) => analytics.bucketTotals[bucket.id] > 0
                  ).length
                }
                /{buckets.length}
              </p>
              <p className="hint">{t('atLeastOnce')}</p>
            </div>
          </div>

          <div className="analytics-details">
            <div className="bucket-stats">
              <h3>{t('bucketTotals')}</h3>
              {buckets.map((bucket) => (
                <div key={bucket.id} className="bucket-stat">
                  <div>
                    <p className="stat-title">{getBucketName(bucket.id)}</p>
                    <p className="stat-value">
                      {analytics.bucketTotals[bucket.id]} selections
        </p>
      </div>
                  <div className="stat-bar">
                    <span
                      style={{
                        width: `${
                          analytics.range.days
                            ? (analytics.bucketTotals[bucket.id] /
                                analytics.range.days) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="timeline">
              <h3>{t('recentPicks')}</h3>
              <ul>
                {analytics.timeline.map((entry) => {
                  const selectionEntries = Object.entries(entry.selections)
                  const nonEmptyEntries = selectionEntries.filter(
                    ([, tasks]) => (tasks || []).length > 0
                  )
                  return (
                    <li key={entry.key}>
                      <span className="date">{entry.key}</span>
                      {nonEmptyEntries.length === 0 ? (
                        <span className="empty">{t('noSelections')}</span>
                      ) : (
                        <span className="tasks">
                          {nonEmptyEntries
                            .map(
                              ([bucketId, tasks]) =>
                                `${getBucketName(bucketId)}: ${(
                                  tasks || []
                                )
                                  .map((taskId) =>
                                    getTaskTitle(bucketId, taskId)
                                  )
                                  .join(', ')}`
                            )
                            .join(' · ')}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </section>
      )}
      {isSettingsOpen && (
        <div className="name-overlay">
          <form className="name-card" onSubmit={handleSettingsSubmit}>
            <h2>
              {isSettingsMode ? t('settingsTitle') : t('focusSettingsTitle')}
            </h2>
            <p>
              {isSettingsMode ? t('settingsSubtitle') : t('focusSettingsSubtitle')}
            </p>
            <label className="form-label" htmlFor="name-input">
              {t('nameLabel')}
            </label>
            <input
              id="name-input"
              type="text"
              placeholder={t('nameLabel')}
              value={formName}
              onChange={(event) => setFormName(event.target.value)}
            />
            <label className="form-label" htmlFor="language-select">
              {t('languageLabel')}
            </label>
            <select
              id="language-select"
              value={formLanguage}
              onChange={(event) => {
                const nextLanguage = event.target.value
                setFormLanguage(nextLanguage)
                setLanguage(nextLanguage)
                window.localStorage.setItem('toeflLanguage', nextLanguage)
              }}
            >
              <option value="en">{t('english')}</option>
              <option value="zh">{t('chinese')}</option>
            </select>
            {isSettingsMode && (
              <div className="form-section">
                <p className="form-label">{t('focusBucketsLabel')}</p>
                <p className="form-label subtle">{t('taskCategoriesLabel')}</p>
                <div className="focus-grid">
                  {buckets.map((bucket) => {
                    const isFocused = formFocusBuckets.includes(bucket.id)
                    return (
                      <label key={bucket.id} className="focus-card">
                        <input
                          type="checkbox"
                          checked={isFocused}
                          onChange={() =>
                            setFormFocusBuckets((prev) =>
                              prev.includes(bucket.id)
                                ? prev.filter((id) => id !== bucket.id)
                                : [...prev, bucket.id]
                            )
                          }
                        />
                        {getBucketName(bucket.id)}
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="form-section">
              <p className="form-label">{t('pointsPerDayLabel')}</p>
              <p className="form-label subtle">{t('pointsHint')}</p>
              <input
                type="number"
                min="10"
                step="5"
                value={formDailyPointGoal}
                onChange={(event) => setFormDailyPointGoal(event.target.value)}
              />
            </div>
            {isSettingsMode && (
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowSettings(false)}
                aria-label="Close"
                title="Close"
              >
                ×
              </button>
            )}
            <div className="form-actions">
              <button type="submit" className="primary">
                {isSettingsMode ? t('save') : t('continue')}
              </button>
              {isSettingsMode && (
                <button
                  type="button"
                  className="secondary"
                  onClick={handleResetProfile}
                >
                  {t('resetProfile')}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      {activeManageBucket && (
        <div className="name-overlay">
          <div className="name-card manage-card">
            <div className="manage-header">
              <div>
                <h2>{getBucketName(activeManageBucket.id)}</h2>
                <p>{t('manageTasks')}</p>
              </div>
            </div>
            <button
              type="button"
              className="modal-close"
              onClick={handleCloseManage}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
            <div className="manage-list">
              {activeManageBucket.tasks.map((task, index) => (
                <div key={task.id} className="manage-row">
                  <span>{getTaskTitle(activeManageBucket.id, task.id)}</span>
                  <div className="manage-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() =>
                        moveTask(
                          activeManageBucket.id,
                          index,
                          Math.max(index - 1, 0)
                        )
                      }
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() =>
                        moveTask(
                          activeManageBucket.id,
                          index,
                          Math.min(
                            index + 1,
                            activeManageBucket.tasks.length - 1
                          )
                        )
                      }
                      disabled={index === activeManageBucket.tasks.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() =>
                        handleDeleteTask(activeManageBucket.id, task.id)
                      }
                    >
                      {t('deleteTask')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
