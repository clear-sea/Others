import os
import tkinter as tk
from tkinter import filedialog as fd
from tkinter import messagebox as m

class FlatButton:
    def __init__(self,parent,text,bind,x,y):
        self.event=bind
        self.btn=tk.Label(parent,text=text,bg="white",fg='#414141')
        self.btn.place(x=x,y=y,width=60,height=30)
        self.btn.bind("<Button-1>",self.press)
        self.btn.bind("<ButtonRelease-1>",self.release)
        self.btn.bind("<Enter>",self.trans1)
        self.btn.bind("<Leave>",self.trans2)
    def press(self,event):
        #按下鼠标左键触发函数，并把按钮背景色改为灰色
        self.btn["bg"]="gray"
        self.event()
    def release(self,event):
        #释放鼠标左键，把按钮背景色改回去
        self.btn["bg"]="white"
    def trans1(self,event):
        #鼠标指针移动到按钮上，文字颜色变为为黑色
        self.btn["fg"]="black"
    def trans2(self,event):
        #鼠标指针移开按钮，文字颜色变回去
        self.btn["fg"]='#414141'

class App:
    def __init__(self):
        #初始化
        self.root=tk.Tk()
        self.root.title("QtBuildTool")
        self.root.geometry("240x30")
        self.root.resizable(False,False)
        self.root.protocol("WN_DELETE_WINDOW",self.quit)
        
        self.openfilename=""
        self.saveasfilename=""
        #定义cmd命令字符串
        self.command="pyuic5 -o "
        #设置四个按钮
        FlatButton(self.root,"Py文件",self.py,0,0)
        FlatButton(self.root,"UI文件",self.ui,60,0)
        FlatButton(self.root,"打包",self.pack,120,0)
        FlatButton(self.root,"退出",self.quit,180,0)
        #主窗口循环
        self.root.mainloop()
    def py(self):
        #获取要保存的python文件名，并添加到cmd命令
        self.saveasfilename=fd.asksaveasfilename(title="Python文件",parent=self.root,filetypes=[("Python",".py"),("Python",".pyw")])
        self.command+=self.saveasfilename+".py "
    def ui(self):
        #获取要转换的UI文件
        self.openfilename=fd.askopenfilename(title="PyQt5 UI文件",parent=self.root,filetypes=[("PyQt",".ui")])
        self.command+=self.openfilename#cmd命令加上UI文件名

        if(self.saveasfilename!=""):
            self.filename1=os.path.split(self.saveasfilename)[0]#获取python文件的路径
            self.filename2=os.path.split(self.saveasfilename)[1]#获取python文件的文件全名
            name=os.path.splitext(self.filename2)[0]#获取python文件的文件名
            #执行命令，把UI文件转换为python文件
            os.system(self.command)
            #转换后得到的文件直接执行看不见效果，需要一些代码写入另一个文件运行其中的主类(也可以添加部分到生成后的文件末尾)，内容如下：
            self.maindata="import sys\nfrom PyQt5.QtWidgets import QApplication, QMainWindow\nimport "+name+"\n\nif __name__ == '__main__':   \n    app = QApplication(sys.argv)\n    MainWindow = QMainWindow()\n    ui = "+name+".Ui_MainWindow()\n    ui.setupUi(MainWindow)\n    MainWindow.show()\n    sys.exit(app.exec())"
            #拼出字符串：main.pyw的路径+文件名
            self.mainfile=self.filename1+"//"+"main.pyw"
            #写入main.pyw
            with open(self.mainfile,"w") as f:
                f.write(self.maindata)
    def quit(self):
        #退出程序函数
        ans=m.askokcancel("关闭","确定要关闭吗")#用tkinter对话框询问是否要关闭
        if(ans):
            #销毁窗口并退出程序
            self.root.quit()
            self.root.destroy()
            quit()
    def pack(self):
        #把python文件打包成exe文件(Pyinstaller)
        command="pyinstaller "
        ans=m.askyesno("打包","是否要打包为单个文件?")
        if(ans):
            command+="-F "
        command+=self.filename1+"//"+"main.pyw "
        ans=m.askyesno("打包","是否要自定义ico图标")
        if(ans):
            ico=fd.askopenfilename(parent=self.root,title="图标",filetype=[("icon图标",".ico")])
            command=command+"-i "+ico
        command=command+" --distpath "+self.filename1+" --specpath "+self.filename1+" --workpath "+self.filename1+"//Build"+" --clean"
        os.system(command)

app=App()

