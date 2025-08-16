import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  PendingActions,
  People,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Analytics } from "@/types";
import { taskService } from "@/services/taskService";
import { StatsCard } from "@/components/analytics/StatsCard";
import { useNotification } from "@/hooks/useNotification";

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

const AnalyticsPage: React.FC = () => {
  const { showError } = useNotification();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      showError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="py-6">
        <Skeleton variant="text" width={300} height={40} className="mb-6" />
        <Grid container spacing={3}>
          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Skeleton
                variant="rectangular"
                height={120}
                className="rounded-lg"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!analytics) return null;

  const pieData = [
    { name: "Completed", value: analytics.overview.completedTasks },
    { name: "Pending", value: analytics.overview.pendingTasks },
  ];

  return (
    <Box className="py-6">
      <Typography
        variant="h4"
        className="font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Total Users"
            value={analytics.overview.totalUsers}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Total Tasks"
            value={analytics.overview.totalTasks}
            icon={<Assignment />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Completed"
            value={analytics.overview.completedTasks}
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Pending"
            value={analytics.overview.pendingTasks}
            icon={<PendingActions />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Completion Rate"
            value={`${analytics.overview.avgCompletionRate}%`}
            icon={<TrendingUp />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={8}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4 font-semibold">
              Tasks Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.tasksOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Tasks Created"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="p-6">
            <Typography variant="h6" className="mb-4 font-semibold">
              Task Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper className="p-6">
        <Typography variant="h6" className="mb-4 font-semibold">
          User Task Details
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">Total Tasks</TableCell>
                <TableCell align="right">Completed</TableCell>
                <TableCell align="right">Pending</TableCell>
                <TableCell align="right">Completion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.tasksPerUser.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="right">{user.totalTasks}</TableCell>
                  <TableCell align="right">{user.completedTasks}</TableCell>
                  <TableCell align="right">{user.pendingTasks}</TableCell>
                  <TableCell align="right">
                    <Box className="flex items-center justify-end gap-2">
                      <LinearProgress
                        variant="determinate"
                        value={user.completionRate}
                        className="flex-1 max-w-[100px]"
                      />
                      <Typography variant="body2">
                        {user.completionRate.toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AnalyticsPage;
