// Shared mood scale, kept in its own module so the MoodCheckIn component file
// only exports a component (keeps react-refresh fast refresh working).
export const MOODS = [
    { v: 1, label: 'Really low' },
    { v: 2, label: 'Low' },
    { v: 3, label: 'Okay' },
    { v: 4, label: 'Good' },
    { v: 5, label: 'Great' },
]
