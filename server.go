package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Nickname string `json:"nickname,omitempty"`
	Status   int    `json:"status"`  // 0 开启 1 禁用
	CreateAt int64  `json:"created"` // 毫秒级时间撮
}

type RouteMeta struct {
	Title  string `json:"title,omitempty"`
	Icon   string `json:"icon,omitempty"`
	Hidden bool   `json:"hidden,omitempty"`
	Fixed  bool   `json:"fixed,omitempty"`
}
type RouteRecordRaw struct {
	Path      string            `json:"path,required"`
	Name      string            `json:"name,required"`
	Component string            `json:"components,omitempty"`
	Redirect  string            `json:"redirect,omitempty"`
	Meta      *RouteMeta        `json:"meta,omitempty"`
	Children  []*RouteRecordRaw `json:"children,omitempty"`
}

const (
	CodeSuccess      = 0     // 成功放行
	CodeParamError   = 40001 // 参数错误（例如非空校验失败）
	CodeAuthExpired  = 40101 // 凭证过期（Token失效）
	CodeNoPermission = 40103 // 权限不足（普通用户访问了管理员接口）
	CodeUserNotFound = 40401 // 用户不存在
	CodeSystemError  = 50000 // 系统内部未知错误
)

var (
	mu            sync.RWMutex
	userIdCounter = 4
	mockUserDB    = []User{
		{ID: 1, Username: "JO", Nickname: "菜鸡", Status: 0, CreateAt: 1767240000000},
		{ID: 2, Username: "KK", Status: 0, CreateAt: 1771137000000},
		{ID: 3, Username: "Ces", Nickname: "测试", Status: 1, CreateAt: 1782831600000},
	}
)

func main() {
	http.HandleFunc("/api/user/list", handleUserList)
	http.HandleFunc("/api/user/add", handleUserAdd)

	http.HandleFunc("/api/menu/routes", handleMenuRoutes)

	fmt.Println("🚀 Vite+Vue+TS 脚手架配套 Go 测试服务已启动！")
	fmt.Println("👉 监听地址: http://localhost:8080")
	fmt.Println("💡 提示：修改此文件后，需在终端按 Ctrl+C 重启服务生效。")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("服务启动失败: %v\n", err)
	}
}

// sendJSON 统一包装标准响应格式
func sendJSON(w http.ResponseWriter, httpStatus int, code int, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatus)
	response := map[string]interface{}{
		"code":    code,
		"message": message,
		"data":    data,
	}
	json.NewEncoder(w).Encode(response)
}

// setupMiddleware 处理跨域(CORS)与全局网络延迟
func setupMiddleware(w http.ResponseWriter, r *http.Request, allowedMethod string) bool {
	// 允许跨域请求
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// 处理浏览器的 OPTIONS 预检请求
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusNoContent)
		return false
	}

	// 强校验请求方法
	if r.Method != allowedMethod {
		sendJSON(w, http.StatusMethodNotAllowed, 405, "请求方法不正确", nil)
		return false
	}

	// ⏳ 模拟 250ms 网络延迟，方便前端观察骨架屏或 Loading 动画
	time.Sleep(250 * time.Millisecond)
	return true
}

func handleUserList(w http.ResponseWriter, r *http.Request) {
	if !setupMiddleware(w, r, "GET") {
		return
	}

	mu.Lock()
	defer mu.Unlock()

	sendJSON(w, http.StatusOK, CodeSuccess, "success", map[string]interface{}{
		"items": mockUserDB,
	})
}

func handleUserAdd(w http.ResponseWriter, r *http.Request) {
	if !setupMiddleware(w, r, "POST") {
		return
	}

	var req struct {
		Username string `json:"username"`
		Nickname string `json:"nickname"`
	}

	// 解析前端传入的 JSON
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Username) == "" {
		sendJSON(w, http.StatusBadRequest, CodeUserNotFound, "用户名不能为空且参数格式需为 JSON", nil)
		return
	}

	mu.Lock()
	defer mu.Unlock()

	// 🛠️ 计算当前 13 位毫秒级时间戳
	milliTimestamp := time.Now().UnixNano() / int64(time.Millisecond)

	newUser := User{
		ID:       userIdCounter,
		Username: req.Username,
		Nickname: req.Nickname,
		Status:   1,              // 默认启用
		CreateAt: milliTimestamp, // 👈 存入 13 位时间戳
	}
	if newUser.Nickname == "" {
		newUser.Nickname = "新进职员"
	}

	userIdCounter++
	mockUserDB = append(mockUserDB, newUser)

	sendJSON(w, http.StatusOK, CodeSuccess, "添加用户成功", newUser)
}

func handleMenuRoutes(w http.ResponseWriter, r *http.Request) {
	if !setupMiddleware(w, r, "GET") {
		return
	}
	dynamicRoutes := []RouteRecordRaw{
		{
			Path:      "/test",
			Name:      "Test",
			Component: "test/test.vue",
			Meta: &RouteMeta{
				Title:  "测试1",
				Hidden: true,
			},
		},
	}
	sendJSON(w, http.StatusOK, CodeSuccess, "success", dynamicRoutes)
}
