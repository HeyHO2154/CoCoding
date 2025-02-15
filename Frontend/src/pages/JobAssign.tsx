interface Job {
  jobId: number;
  jobName: string;
  description: string;
  status: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
}

const JobAssign = () => {
  // ... 기존 state들

  return (
    <div>
      <h2>업무 배정 관리</h2>
      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.jobId} className="job-item">
            <h3>{job.jobName}</h3>
            <p>{job.description}</p>
            <div className="assignment-info">
              <div className="current-assignment">
                {job.assignedTo ? (
                  <>
                    <p>현재 담당자: {job.assignedTo}</p>
                    <p className="assignment-detail">
                      배정자: {job.assignedBy} ({new Date(job.assignedAt!).toLocaleString()})
                    </p>
                  </>
                ) : (
                  <p>담당자 미배정</p>
                )}
              </div>
              <div className="assign-control">
                <select
                  value={selectedUsers[job.jobId] || ''}
                  onChange={(e) => handleUserSelect(job.jobId, e.target.value)}
                >
                  <option value="">담당자 선택</option>
                  {users.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                <button onClick={() => handleAssign(job.jobId)}>배정</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobAssign; 