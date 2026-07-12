export const lessons = [
  { number: '01', time: '03:46', title: 'Entender el contrato antes de tocar estado', text: 'La API recibe start y count. Repetir la llamada con los valores por defecto siempre devuelve el mismo tramo; concatenarlo solo duplica usuarios. La página debe convertirse en offset: page × PAGE_SIZE.' },
  { number: '02', time: '12:09', title: 'Una función debe cumplir su nombre', text: 'loadMore no solo pide datos: debe avanzar la página y conservar los resultados previos. Separar la intención —avanzar— del efecto —pedir— deja un flujo pequeño y predecible.' },
  { number: '03', time: '17:01', title: 'La página dispara la petición', text: 'El botón solo incrementa page. El efecto observa page, solicita ese lote y lo agrega con un setter funcional. count también sería dependencia si no fuese una constante.' },
  { number: '04', time: '19:25', title: 'Imperativo o declarativo es una decisión', text: 'Llamar a la API desde el handler ofrece control explícito. Hacerlo desde un effect expresa que los datos son consecuencia de page. En este ejercicio encaja lo declarativo; no es una regla universal.' },
  { number: '05', time: '21:57', title: 'No pedir lo que ya no existe', text: 'La respuesta incluye total. Compararlo con users.length permite retirar el botón o el observador al alcanzar el final. Durante una petición, loading bloquea llamadas concurrentes.' },
  { number: '06', time: '25:16', title: 'El final de la lista es el disparador', text: 'IntersectionObserver vigila un sentinel bajo los usuarios. Cuando entra en el viewport avanza la página; rootMargin puede anticipar la carga para que el usuario no llegue a ver la espera.' },
  { number: '07', time: '32:39', title: 'Dependencias y cleanup importan', text: 'El callback debe leer valores actuales, no una stale closure. El efecto declara sus dependencias y devuelve observer.disconnect(): así no quedan observadores vivos ni callbacks con datos antiguos.' },
]

export const paginationCode = `const PAGE_SIZE = 8
const offset = page * PAGE_SIZE
const result = await api.list(offset, PAGE_SIZE)

setUsers(current => [...current, ...result.items])
setTotal(result.total)`

export const observerCode = `useEffect(() => {
  const target = sentinelRef.current
  if (!target || loading || users.length >= total) return

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) setPage(page => page + 1)
  }, { rootMargin: '160px' })

  observer.observe(target)
  return () => observer.disconnect()
}, [loading, total, users.length])`
