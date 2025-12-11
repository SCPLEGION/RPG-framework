# Frontend Guide

## Project Structure

### `/src/pages`
Individual page components for each route:
- **AboutPage.jsx** - Landing/home page with features and team info
- **Dashboard.jsx** - Main dashboard with statistics and overview
- **TicketViewer.jsx** - Support ticket management interface
- **Profile.jsx** - User profile and account settings
- **Settings.jsx** - Application preferences and configuration
- **Help.jsx** - FAQ and support resources
- **Admin.jsx** - Admin panel for user and system management
- **login.jsx** - Discord OAuth login page
- **docs.jsx** - API documentation viewer

### `/src/components`
Reusable UI components:
- **Navigation.jsx** - Main navigation sidebar with menu items
- **LoadingSpinner.jsx** - Loading indicator component
- **ErrorMessage.jsx** - Error display with retry functionality
- **PageHeader.jsx** - Page header with title, icon, and actions

### `/src/services`
API communication and data fetching:
- **ApiService.js** - Centralized API client with:
  - Request deduplication for GET requests
  - Response caching with TTL
  - Automatic token handling
  - Error handling with 401 detection

### `/src/utils`
Utility modules:
- **cache.js** - ResponseCache class for client-side caching

### `/src/addons`
Layout and context providers:
- **navbar.jsx** - Main layout with navbar, sidebars, and theme context

### `/src/main.jsx`
Entry point that renders the app with providers

## Styling & Theme

### Color Palette
- **Primary**: `#667eea` (Blue)
- **Secondary**: `#764ba2` (Purple)
- **Success**: `#4CAF50` (Green)
- **Error**: `#F44336` (Red)
- **Warning**: `#FF9800` (Orange)
- **Info**: `#4facfe` (Cyan)

### Common Styles
All cards and containers use:
```jsx
sx={{
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 3,
}}
```

### Gradients
Primary gradient for text and buttons:
```jsx
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
```

## Usage Examples

### Creating a New Page

```jsx
import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavbar } from '../addons/navbar';
import PageHeader from '../components/PageHeader';
import SomeIcon from '@mui/icons-material/SomeIcon';

const MyPage = () => {
  const { setOption, setSidebarLeftDisabled, setSidebarRightDisabled } = useNavbar();

  useEffect(() => {
    setOption('mypage');
    setSidebarLeftDisabled(false);
    setSidebarRightDisabled(true);
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)',
      pt: 4,
      pb: 4,
    }}>
      <Container maxWidth="lg">
        <PageHeader
          title="My Page"
          subtitle="A brief description"
          icon={SomeIcon}
        />
        {/* Page content */}
      </Container>
    </Box>
  );
};

export default MyPage;
```

### Using ApiService

```jsx
import ApiService from '../services/ApiService';

// Get tickets
const tickets = await ApiService.getTickets();

// Get current user
const user = await ApiService.getCurrentUser();

// Reply to ticket
await ApiService.replyToTicket(ticketId, content);

// Close ticket
await ApiService.closeTicket(ticketId);

// Delete ticket
await ApiService.deleteTicket(ticketId);
```

### Using Navigation Context

```jsx
import { useNavbar } from '../addons/navbar';

const MyComponent = () => {
  const { 
    option, 
    setOption,
    theme,
    toggleTheme,
    userInfo,
    setContentLeft,
    setSidebarLeftDisabled,
  } = useNavbar();

  useEffect(() => {
    setOption('mypage');
  }, []);

  return <div>{userInfo?.username}</div>;
};
```

### Using Components

```jsx
import { PageHeader, LoadingSpinner, ErrorMessage } from '../components';

// Page header
<PageHeader
  title="Title"
  subtitle="Subtitle"
  icon={SomeIcon}
  actionButton={<Button>Action</Button>}
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Current', href: '/current' },
  ]}
/>

// Loading spinner
<LoadingSpinner message="Loading data..." />

// Error message with retry
<ErrorMessage
  message="Failed to load"
  severity="error"
  onRetry={() => fetchData()}
/>
```

## API Integration

### Authentication
The app uses Discord OAuth for authentication:
1. User clicks "Login with Discord"
2. Backend redirects to Discord OAuth
3. Discord returns to `/login/callback` with user data
4. User is redirected to dashboard with JWT token
5. Token is stored in localStorage

### Making API Calls
Always use ApiService for consistency:
```jsx
try {
  const data = await ApiService.getTickets();
  setTickets(data);
} catch (error) {
  if (error.message === 'Authentication expired') {
    // Handle expired token
    navigate('/login');
  } else {
    setError('Failed to load tickets');
  }
}
```

## Performance Optimization

### Code Splitting
The app uses route-based code splitting. Each page is loaded on-demand.

### Caching Strategy
- **API Responses**: 1 minute TTL by default
- **Requests**: GET requests are deduplicated automatically
- **Config**: Cached for session duration

### Best Practices
1. Use `useCallback` for event handlers in lists
2. Use `useMemo` for expensive computations
3. Lazy load images where possible
4. Avoid inline function definitions in JSX

## Responsive Design

The app uses Material-UI's responsive breakpoints:
- `xs` - Extra small (0px)
- `sm` - Small (600px)
- `md` - Medium (960px)
- `lg` - Large (1280px)
- `xl` - Extra large (1920px)

Example:
```jsx
<Box sx={{
  fontSize: { xs: '14px', md: '18px' },
  padding: { xs: 1, md: 3 },
}}/>
```

## Deployment

### Build
```bash
npm run build
```

The build outputs to `frontend/main/dist/`

### Optimization
The production build includes:
- Code minification with Terser
- Code splitting by chunks
- Source maps disabled
- Console statements removed
- Dead code elimination

### Environment Variables
Create a `.env` file in `frontend/main/`:
```
VITE_API_URL=https://api.example.com
REACT_APP_API_URL=https://api.example.com
```

## Troubleshooting

### Pages Not Showing
1. Check that route is added to `App.jsx`
2. Verify component export is default
3. Check browser console for errors

### Styling Issues
1. Ensure MUI theme is applied via NavbarProvider
2. Check color palette matches theme
3. Use sx prop for inline styles (not className)

### API Errors
1. Check token validity in localStorage
2. Verify API endpoint is correct
3. Check CORS headers from backend
4. Use browser dev tools Network tab

## Contributing

When adding new pages:
1. Create page in `/src/pages`
2. Add route to `App.jsx`
3. Update Navigation.jsx if needed
4. Use consistent styling and component patterns
5. Document any new utilities in this guide
