import { useNotification } from "@/hooks/useNotification";
import { taskService } from "@/services/taskService";
import { Analytics } from "@/types";
import {
  Assignment,
  BarChart as BarChartIcon,
  CheckCircle,
  PendingActions,
  People,
  PieChart as PieChartIcon,
  ShowChart,
  TrendingUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { format, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { StatsCard } from "./StatsCard";

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444"];

export const Dashboard: React.FC = () => {
  const { showError } = useNotification();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("area");
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

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

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "line" | "bar" | "area" | null
  ) => {
    if (newType !== null) {
      setChartType(newType);
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
        <Grid container spacing={3} className="mt-3">
          <Grid item xs={12} md={8}>
            <Skeleton
              variant="rectangular"
              height={400}
              className="rounded-lg"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton
              variant="rectangular"
              height={400}
              className="rounded-lg"
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!analytics) return null;

  const pieData = [
    {
      name: "Completed",
      value: analytics.overview.completedTasks,
      color: "#10b981",
    },
    {
      name: "Pending",
      value: analytics.overview.pendingTasks,
      color: "#f59e0b",
    },
  ];

  // Generate mock data for trend (since we need more data points for better visualization)
  const generateTrendData = () => {
    const data = [];
    for (let i = dateRange - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const existingData = analytics.tasksOverTime.find(
        (item) => item._id === format(date, "yyyy-MM-dd")
      );
      data.push({
        date: format(date, "MMM dd"),
        tasks: existingData?.count || Math.floor(Math.random() * 10),
        completed: Math.floor(Math.random() * 8),
        pending: Math.floor(Math.random() * 5),
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  return (
    <Box className="py-6 animate-fade-in">
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography
            variant="h4"
            className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1">
            Track your team's productivity and task completion metrics
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={dateRange}
          exclusive
          onChange={(e, value) => value && setDateRange(value)}
          size="small"
        >
          <ToggleButton value={7}>7 Days</ToggleButton>
          <ToggleButton value={30}>30 Days</ToggleButton>
          <ToggleButton value={90}>90 Days</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Total Users"
            value={analytics.overview.totalUsers}
            icon={<People />}
            color="primary"
            trend="+12%"
            trendDirection="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Total Tasks"
            value={analytics.overview.totalTasks}
            icon={<Assignment />}
            color="secondary"
            trend="+8%"
            trendDirection="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Completed"
            value={analytics.overview.completedTasks}
            icon={<CheckCircle />}
            color="success"
            trend="+15%"
            trendDirection="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Pending"
            value={analytics.overview.pendingTasks}
            icon={<PendingActions />}
            color="warning"
            trend="-5%"
            trendDirection="down"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="Completion Rate"
            value={`${analytics.overview.avgCompletionRate}%`}
            icon={<TrendingUp />}
            color="info"
            trend="+3%"
            trendDirection="up"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} lg={8}>
          <ChartCard
            title="Task Trends"
            subtitle={`Last ${dateRange} days`}
            action={
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                size="small"
              >
                <ToggleButton value="area">
                  <ShowChart fontSize="small" />
                </ToggleButton>
                <ToggleButton value="bar">
                  <BarChartIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="line">
                  <PieChartIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              {chartType === "area" ? (
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorTasks)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              ) : chartType === "bar" ? (
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tasks" fill="#3b82f6" />
                  <Bar dataKey="completed" fill="#10b981" />
                  <Bar dataKey="pending" fill="#f59e0b" />
                </BarChart>
              ) : (
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <ChartCard
            title="Task Distribution"
            subtitle="Overall completion status"
          >
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* User Table */}
      <Paper className="p-6 animate-slide-up">
        <Typography variant="h6" className="mb-4 font-semibold">
          User Performance Metrics
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell align="center">Total Tasks</TableCell>
                <TableCell align="center">Completed</TableCell>
                <TableCell align="center">Pending</TableCell>
                <TableCell align="center">Completion Rate</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.tasksPerUser.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box className="flex items-center gap-2">
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {user.email[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={user.totalTasks} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.completedTasks}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.pendingTasks}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex items-center justify-center gap-2">
                      <LinearProgress
                        variant="determinate"
                        value={user.completionRate}
                        className="flex-1 max-w-[100px]"
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            background:
                              user.completionRate > 75
                                ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
                                : user.completionRate > 50
                                ? "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)"
                                : "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
                          },
                        }}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {user.completionRate.toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        user.completionRate > 75
                          ? "Excellent"
                          : user.completionRate > 50
                          ? "Good"
                          : "Needs Improvement"
                      }
                      size="small"
                      color={
                        user.completionRate > 75
                          ? "success"
                          : user.completionRate > 50
                          ? "primary"
                          : "warning"
                      }
                    />
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
