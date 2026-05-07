export function formatPosterDate(date: Date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

