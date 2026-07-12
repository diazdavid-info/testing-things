export const lessons = [
  { number: '01', title: 'El formulario manda', text: 'Escucha onSubmit en <form>, no onClick en el botón. Enter funciona, la semántica es correcta y event.currentTarget evita una ref innecesaria.' },
  { number: '02', title: 'Estado como snapshot', text: 'Un setter solicita el siguiente render; no cambia la variable que ya tiene el handler. Para calcular desde el valor anterior, usa el callback del setter.' },
  { number: '03', title: 'Deriva, no sincronices', text: 'Si un dato sale de props o estado existente, calcúlalo durante el render. Guardarlo de nuevo crea dos fuentes de verdad.' },
  { number: '04', title: 'Effect cruza fronteras', text: 'useEffect sirve para sincronizar React con algo externo: aquí, el listener global de teclado. Suscribirse exige limpiar la suscripción.' },
]

export const duplicatedStateExample = `const [filtered, setFiltered] = useState([])

useEffect(() => {
  setFiltered(users.filter(matches))
}, [users, query])`

export const derivedValueExample = `const filtered = users.filter(matches)

// Si el cálculo fuese realmente costoso:
const filtered = useMemo(
  () => users.filter(matches),
  [users, query]
)`
