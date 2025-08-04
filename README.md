# MRCOG-1 Telegram Bot Admin Panel

A modern React admin panel for managing MRCOG-1 questions and monitoring the Telegram bot performance.

## 🚀 Features

- **Dashboard**: Real-time statistics and bot performance metrics
- **Question Management**: Add, edit, and manage MRCOG-1 questions
- **Search & Filter**: Advanced search and filtering capabilities
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Updates**: Live data updates and status monitoring
- **Export Functionality**: Export questions and reports
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React Icons
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API (separate repository)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with sidebar
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard with statistics
│   ├── AddQuestion.tsx # Add new question form
│   └── ManageQuestions.tsx # Question management table
├── services/           # API services
│   └── api.ts         # Axios configuration and API calls
├── App.tsx            # Main app component with routing
├── main.tsx           # App entry point
└── index.css          # Global styles with Tailwind
```

## 🔧 Configuration

### API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |

## 📊 Dashboard Features

- **Statistics Cards**: Total questions, active users, daily posts, interactions
- **Recent Activity**: Latest bot activities and status
- **Quick Actions**: Fast access to common tasks
- **Real-time Updates**: Live data from the backend

## ❓ Question Management

### Adding Questions
- Topic selection (Obstetrics, Gynecology, etc.)
- Multiple choice options (A, B, C, D)
- Correct answer selection
- Detailed explanations
- Form validation

### Managing Questions
- Search by question text or topic
- Filter by topic category
- View question details in modal
- Toggle question active/inactive status
- Export functionality

## 🎨 UI Components

### Layout
- Fixed sidebar navigation
- Responsive design
- Active state indicators
- Clean, modern styling

### Forms
- Comprehensive validation
- Loading states
- Success/error messages
- Accessible form controls

### Tables
- Sortable columns
- Search and filter
- Pagination (ready for implementation)
- Action buttons

## 🔌 API Integration

The admin panel is designed to work with a Node.js/Express backend. Key API endpoints:

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `PATCH /api/questions/:id/toggle` - Toggle active status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Bot
- `GET /api/bot/status` - Get bot status
- `POST /api/bot/test-message` - Send test message
- `PUT /api/bot/schedule` - Update posting schedule

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Netlify

1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Set environment variables

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist` folder to your web server
3. Configure environment variables

## 🔒 Security

- JWT token authentication (ready for implementation)
- API request/response interceptors
- Environment variable protection
- CORS configuration support

## 📱 Mobile Responsive

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Real-time notifications
- [ ] Advanced analytics and charts
- [ ] Bulk question import/export
- [ ] Question categories and tags
- [ ] User management
- [ ] Audit logs
- [ ] Dark mode theme

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for MRCOG-1 exam preparation**
