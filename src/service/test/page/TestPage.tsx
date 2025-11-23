import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { useStudentStore } from "@/repositories/studentRepository/store/studentStore";
import { studentGradeOptions } from "@/repositories/studentRepository/constants";

const TestPage = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [testLog, setTestLog] = useState<string[]>([]);

  // Zustand Store
  const {
    students,
    isLoading,
    error,
    getStudents,
    createStudent,
    deleteStudent,
    clearError,
  } = useStudentStore();

  // 인증 상태 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        log(`인증 상태 변경: ${user.email}`);
      }
    });
    return () => unsubscribe();
  }, []);

  // 에러 감지
  useEffect(() => {
    if (error) {
      log(`❌ 에러 발생: ${error.message}`);
      clearError();
    }
  }, [error, clearError]);

  const log = (message: string) => {
    setTestLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // 로그인
  const handleLogin = async () => {
    try {
      log("Google 로그인 시도...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      log(`✅ 로그인 성공: ${result.user.email}`);
      log(`   UID: ${result.user.uid}`);
    } catch (err) {
      log(`❌ 로그인 실패: ${err}`);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      log("✅ 로그아웃 완료");
    } catch (err) {
      log(`❌ 로그아웃 실패: ${err}`);
    }
  };

  // GET 테스트 - 학생 목록 조회
  const handleGetTest = async () => {
    if (!user) return;
    log("GET 테스트 시작...");
    log(`   경로: users/${user.uid}/students`);

    await getStudents();
    log(`✅ GET 성공! ${students.length}개 학생 조회됨`);
  };

  // CREATE 테스트 - 테스트 학생 생성
  const handleCreateTest = async () => {
    if (!user) return;
    log("CREATE 테스트 시작...");

    const randomGrade = studentGradeOptions.OPTIONS[
      Math.floor(Math.random() * studentGradeOptions.OPTIONS.length)
    ].value;

    await createStudent({
      name: `테스트학생_${Date.now().toString().slice(-4)}`,
      email: `test${Date.now()}@test.com`,
      grade: randomGrade,
      school: "테스트중학교",
      status: "active",
      isActive: true,
    });

    log(`✅ CREATE 성공!`);
    // 목록 새로고침
    await getStudents();
  };

  // DELETE 테스트 - 첫 번째 학생 삭제
  const handleDeleteTest = async () => {
    if (!user || students.length === 0) return;

    const target = students[0];
    log(`DELETE 테스트 시작... (${target.name})`);

    await deleteStudent(target.id);
    log(`✅ DELETE 성공! ID: ${target.id}`);

    // 목록 새로고침
    await getStudents();
  };

  return (
    <div style={{ padding: 20, fontFamily: "monospace", maxWidth: 800, margin: "0 auto" }}>
      <h1>🔥 Firebase Firestore 연결 테스트</h1>
      <p style={{ color: "#666" }}>
        Repository Pattern: <code>studentRepository → studentStore</code>
      </p>

      {/* 인증 섹션 */}
      <section style={{ marginBottom: 20, padding: 15, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>1. 인증 (Google)</h2>
        <div style={{ marginBottom: 10 }}>
          <strong>상태:</strong>{" "}
          {user ? (
            <span style={{ color: "green" }}>✅ {user.email}</span>
          ) : (
            <span style={{ color: "red" }}>❌ 로그아웃</span>
          )}
        </div>
        {user && (
          <div style={{ marginBottom: 10, fontSize: 12, color: "#666" }}>
            UID: {user.uid}
          </div>
        )}
        <div>
          {!user ? (
            <button onClick={handleLogin} style={buttonStyle}>
              🔐 Google 로그인
            </button>
          ) : (
            <button onClick={handleLogout} style={buttonStyle}>
              로그아웃
            </button>
          )}
        </div>
      </section>

      {/* API 테스트 섹션 */}
      <section style={{ marginBottom: 20, padding: 15, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>2. Repository CRUD 테스트</h2>
        <div style={{ marginBottom: 15 }}>
          <button onClick={handleGetTest} disabled={!user || isLoading} style={buttonStyle}>
            📥 GET (학생 목록)
          </button>
          <button
            onClick={handleCreateTest}
            disabled={!user || isLoading}
            style={{ ...buttonStyle, marginLeft: 10 }}
          >
            ➕ CREATE (학생 추가)
          </button>
          <button
            onClick={handleDeleteTest}
            disabled={!user || isLoading || students.length === 0}
            style={{ ...buttonStyle, marginLeft: 10 }}
          >
            🗑️ DELETE (첫번째 삭제)
          </button>
        </div>
        <div>
          <strong>로딩:</strong> {isLoading ? "⏳ 처리중..." : "✅ 대기"}
        </div>
      </section>

      {/* 결과 섹션 */}
      <section style={{ marginBottom: 20, padding: 15, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>3. 조회 결과 ({students.length}개)</h2>
        <pre
          style={{
            maxHeight: 200,
            overflow: "auto",
            background: "#f8f9fa",
            padding: 10,
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          {students.length > 0
            ? JSON.stringify(
                students.map((s) => ({
                  id: s.id,
                  name: s.name,
                  grade: s.grade,
                  status: s.status,
                })),
                null,
                2
              )
            : "데이터 없음 - GET 버튼을 클릭하세요"}
        </pre>
      </section>

      {/* 로그 섹션 */}
      <section style={{ padding: 15, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>
          4. 테스트 로그{" "}
          <button onClick={() => setTestLog([])} style={{ fontSize: 12 }}>
            지우기
          </button>
        </h2>
        <pre
          style={{
            maxHeight: 250,
            overflow: "auto",
            background: "#1e1e1e",
            color: "#4ec9b0",
            padding: 10,
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          {testLog.length > 0 ? testLog.join("\n") : "테스트 로그가 여기에 표시됩니다"}
        </pre>
      </section>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: 14,
  cursor: "pointer",
  borderRadius: 4,
  border: "1px solid #ccc",
  background: "#fff",
};

export default TestPage;
