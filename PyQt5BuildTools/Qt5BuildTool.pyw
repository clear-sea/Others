import os
import tkinter as tk
from tkinter import filedialog as fd

class FlatButton:
    def __init__(self,parent,text,bind,x,y):
        self.event=bind
        self.btn=tk.Label(parent,text=text,bg="white")
        self.btn.place(x=x,y=y,width=60,height=30)
        self.btn.bind("<Button-1>",self.press)
        self.btn.bind("<ButtonRelease-1>",self.release)
    def press(self,event):
        self.btn["bg"]="gray"
        self.event()
    def release(self,event):
        
        self.btn["bg"]="white"

class App:
    def __init__(self):
        self.root=tk.Tk()
        self.root.title("QtBuildTool")
        self.root.geometry("240x30")
        self.root.resizable(False,False)
        
        self.openfilename=""
        self.saveasfilename=""

        self.command="pyuic5 -o "
        
        FlatButton(self.root,"Py文件",self.py,0,0)
        FlatButton(self.root,"UI文件",self.ui,60,0)
        FlatButton(self.root,"取消",self.root.destroy,180,0)

        self.root.mainloop()
    def py(self):
        self.saveasfilename=fd.asksaveasfilename(title="py",parent=self.root,filetypes=[("Python",".py"),("Python",".pyw")])
        self.command+=self.saveasfilename+".py "
    def ui(self):
        self.openfilename=fd.askopenfilename(title="ui",parent=self.root,filetypes=[("PyQt",".ui")])
        self.command+=self.openfilename

        self.filename1=os.path.split(self.saveasfilename)[0]
        self.filename2=os.path.split(self.saveasfilename)[1]
        name=os.path.splitext(self.filename2)[0]
        
        os.system(self.command)
        self.maindata="import sys\nfrom PyQt5.QtWidgets import QApplication, QMainWindow\nimport "+name+"\n\nif __name__ == '__main__':   \n    app = QApplication(sys.argv)\n    MainWindow = QMainWindow()\n    ui = "+name+".Ui_MainWindow()\n    ui.setupUi(MainWindow)\n    MainWindow.show()\n    sys.exit(app.exec())"

        self.mainfile=self.filename1+"//"+"main.pyw"
        with open(self.mainfile,"w") as f:
            f.write(self.maindata)

app=App()

