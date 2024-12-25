export default function updateAttendance(token, attendanceInfo, time){
    return new Promise(resolve => {
        fetch(`${window.location.origin}/api/organization/attendences/update-attendance`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({attendanceInfo, time})
        }).then(res => res.json()).then(res => resolve(res))
    })
}