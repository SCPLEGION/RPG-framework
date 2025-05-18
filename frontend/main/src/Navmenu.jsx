import { Button, AppBar, Toolbar, Typography } from "@mui/material";
// Navmenu.jsx
function NavMenu() {
  return (
    <AppBar position="static">
      <Toolbar>
        <div className="nav-menu-logo">
          <img src="/logo.png" alt="Logo" style={{ height: "40px", marginRight: "16px" }} />
        </div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Home</a>
          <a href="/about" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>About</a>
          <a href="/tickets" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Tickets</a>
          <a href="/docs" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Docs</a>
          <a href="/casino" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Casino</a>
        </Typography>
        <Button variant="contained" color="secondary" href="/login">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavMenu;
