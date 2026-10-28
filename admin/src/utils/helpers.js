export const addRemoveFromList = (list, val) => {
  if (!list.includes(val)) {
    list.push(val)
  } else {
    list.splice(list.indexOf(val), 1)
  }
  return list
}

// Immutably set a value at a dot-separated path, e.g. setIn(obj, 'links.enabled', true)
export const setIn = (obj, path, value) => {
  const [key, ...rest] = path.split('.')
  return {
    ...obj,
    [key]: rest.length ? setIn(obj?.[key] ?? {}, rest.join('.'), value) : value,
  }
}
