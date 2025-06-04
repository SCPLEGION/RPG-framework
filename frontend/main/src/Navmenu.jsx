import { Button, AppBar, Toolbar, Typography } from "@mui/material";
// Navmenu.jsx
function NavMenu() {
  // Check if user exists in localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <AppBar position="static">
        <Toolbar>
          <div className="nav-menu-logo">
            <img src="/logo.png" alt="Logo" style={{ height: "40px", marginRight: "16px" }} />
          </div>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a href="/" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>Home</a>
            <a href="/about" style={{ textDecoration: "none", color: "inherit", marginRight: "16px" }}>About</a>
          </Typography>
          <Button variant="contained" color="secondary" href="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  // Show this when logged in
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
          />
          <Typography variant="body1" color="inherit" sx={{ marginRight: 2 }}>
            {user.username}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default NavMenu;
