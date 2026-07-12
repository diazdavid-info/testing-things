export const lessons = [
  { number: '01', time: '01:14', title: 'Evitar la recarga', text: 'Cande identifica que el envío nativo del formulario recarga la página. La primera corrección es escuchar onSubmit y llamar a event.preventDefault() al comienzo del handler.' },
  { number: '02', time: '02:47', title: 'Limpiar el formulario', text: 'Después de agregar un usuario, los campos conservan sus valores. Prueban form.reset() y exploran como alternativa form.elements, que permite acceder a los controles por su atributo name.' },
  { number: '03', time: '07:43', title: 'Validar los datos', text: 'Nombre y email son obligatorios, y el email debe tener formato válido. Usan required y type="email", comentan que el handler puede reforzar la validación y que un backend siempre debe validarla otra vez.' },
  { number: '04', time: '11:23', title: 'Impedir emails repetidos', text: 'Antes de agregar, comprueban si ya existe el email. La conversación compara some, que devuelve un booleano, con find, que devuelve el elemento o undefined. El error debería mostrarse en la interfaz.' },
  { number: '05', time: '16:05', title: 'Ordenar de A–Z y Z–A', text: 'Añaden un select controlado con la dirección del orden. Los usuarios ordenados se obtienen a partir de users y sort mediante useMemo, usando localeCompare para comparar los nombres.' },
]

export const duplicateCode = `const emailExists = users.some(
  user => user.email === email
)

if (emailExists) {
  setError('Ese email ya está en el directorio')
  return
}`

export const sortCode = `const sortedUsers = useMemo(() => {
  return [...users].sort((a, b) =>
    sort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  )
}, [sort, users])`
