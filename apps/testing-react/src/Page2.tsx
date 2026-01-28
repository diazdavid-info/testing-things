import {useLocation, useNavigate} from 'react-router'

function Page2() {
  const navigate = useNavigate();
  const location = useLocation();
  const {some} = location.state

  const handleClick = () => {
    navigate('/')
  }

  return (
    <main>
      <h1>Page 2 {some}</h1>
      <button onClick={handleClick}>Go to Page 1</button>
    </main>
  )
}

export default Page2
