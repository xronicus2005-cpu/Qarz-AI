import {Container, Button,} from "@mui/material"
import { Link } from 'react-router-dom'

const Header = () => {
  
  //here is a header component
  return(
    <>
      <Container style={{backgroundColor: "rgb(13, 109, 204)",padding: "1rem", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>

        {/**Logo */}
        <Link to="/" style={{fontWeight: 600, color: "#fff", fontSize: "25px", textDecoration: "none"}}>
          Qarz dapteri
        </Link>

        {/**nav bar */}


        {/**btns */}
        <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
          <Button style={{color: "#fff"}}>Lock</Button>
          <Link style={{ color: "#fff", textDecoration: "none"}}>Qariydarlar</Link>
          <Link style={{ color: "#fff", textDecoration: "none"}} >Qarizlar</Link>
        </div>
        
      </Container>
    </>
  )
}

export default Header