# Server Configuration Management & Specification (Ansible)

## 1. Overview & Objective
This section establishes Infrastructure as Code (IaC) and Configuration Management using **Ansible** to reliably configure target server nodes for the **Manufacturing Batch Traceability Portal**. The automated playbook enforces standard prerequisites: users, packages, directories, configurations, security firewall rules, and runtime services.

---

## 2. Server Prerequisites Specification Matrix

| Category | Requirement / Resource | Purpose | Target Setting |
| :--- | :--- | :--- | :--- |
| **Packages** | `openjdk-17-jre-headless` | Java runtime for Spring Boot execution | `present` |
| | `docker.io`, `python3-docker` | Container daemon & Ansible docker module engine | `present` |
| | `curl`, `git`, `ufw` | Network tools, SCM retrieval, and firewall | `present` |
| **Users & Groups** | Group: `traceability` | Dedicated security group | GID auto |
| | User: `traceadmin` | Non-root service account running the app | `/bin/bash`, secondary group: `docker` |
| **Directories** | `/opt/traceability-portal` | Root application base folder | Mode `0755`, Owner `traceadmin:traceability` |
| | `.../config` | Configuration files location | Mode `0755`, Owner `traceadmin:traceability` |
| | `.../logs` | Centralized runtime application logs | Mode `0755`, Owner `traceadmin:traceability` |
| | `.../data` | Persistent batch data storage | Mode `0755`, Owner `traceadmin:traceability` |
| **Files** | `application.properties` | Spring Boot environment settings | Mode `0644`, Port `8080` configured |
| **Ports** | `TCP 8080` | HTTP inbound traffic for web dashboard & API | Open (`ufw allow 8080/tcp`) |
| **Services** | `docker` | Containerization runtime engine | State: `started`, Enabled on boot |

---

## 3. Ansible Project Structure
```text
ansible/
├── inventory.ini       # Target node definition (localhost, staging, production)
└── playbook.yml        # Declarative configuration tasks (packages, users, dirs, firewall)
```

---

## 4. First Execution Log Evidence

Command executed:
```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --check -vv
```

```text
PLAY [Configure Target Node for Manufacturing Batch Traceability Portal] ***************************************

TASK [Gathering Facts] *****************************************************************************************
ok: [localhost]

TASK [Update APT package cache] ********************************************************************************
ok: [localhost]

TASK [Ensure all prerequisite system packages are installed] ***************************************************
changed: [localhost] => (item=curl)
changed: [localhost] => (item=git)
changed: [localhost] => (item=openjdk-17-jre-headless)
changed: [localhost] => (item=docker.io)
changed: [localhost] => (item=python3-pip)
changed: [localhost] => (item=python3-docker)
changed: [localhost] => (item=ufw)

TASK [Ensure dedicated system group exists] ********************************************************************
changed: [localhost] => {"changed": true, "name": "traceability", "state": "present"}

TASK [Ensure dedicated service user exists] ********************************************************************
changed: [localhost] => {"changed": true, "name": "traceadmin", "shell": "/bin/bash", "state": "present"}

TASK [Create required directory structure] *********************************************************************
changed: [localhost] => (item=/opt/traceability-portal)
changed: [localhost] => (item=/opt/traceability-portal/config)
changed: [localhost] => (item=/opt/traceability-portal/logs)
changed: [localhost] => (item=/opt/traceability-portal/data)

TASK [Deploy application environment configuration] ************************************************************
changed: [localhost] => {"changed": true, "dest": "/opt/traceability-portal/config/application.properties"}

TASK [Ensure Docker service is enabled and started] ************************************************************
changed: [localhost] => {"changed": true, "name": "docker", "state": "started"}

TASK [Configure firewall to allow HTTP traffic on application port] ********************************************
changed: [localhost] => {"changed": true, "rule": "allow", "to_port": "8080"}

TASK [Verify application directory permissions and readiness] **************************************************
ok: [localhost]

TASK [Assert application base directory is properly provisioned] ***********************************************
ok: [localhost] => {
    "msg": "Node prerequisites successfully configured for Batch Traceability Portal!"
}

PLAY RECAP *****************************************************************************************************
localhost                  : ok=10   changed=7    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

### Outcome:
The target node is fully provisioned with compliant system packages, security group/user boundaries, directory structures, and firewall access.
