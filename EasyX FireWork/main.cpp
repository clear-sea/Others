#include<iostream>
#include<cmath>
#include<graphics.h>
#include<ctime>
#include<vector>

using namespace std;
/*Vec结构体*/
struct Int_Vec {
	int x, y;
};
struct Double_Vec {
	double x, y;
};

/*全局变量*/
COLORREF trail_colors[5] = { RGB(45, 45, 45), RGB(60, 60, 60), RGB(75, 75, 75), RGB(125, 125, 125), RGB(150, 150, 150) };
Double_Vec gravity;
int WIDTH = 800, HEIGHT = 800;
int dynamic_offset = 1;
int static_offset = 3;

/*烟花颜色-FireworkColor结构体*/
struct FireworkColor{
	int R, G, B;
};
/*Trail类轨迹*/
class Trail {
	public:
		int pos_in_line, size;
		Int_Vec pos;
		bool dynamic;
		COLORREF color;

		void init(int n, int size, bool dynamic) {
			this->pos.x = 0; this->pos.y = 0;
			this->pos_in_line = n;
			this->dynamic = dynamic;
			
			if (this->dynamic) {
				this->size = size - n / 2;
				this->color = trail_colors[n];
			}
			else {
				this->color = RGB(255, 255, 200);
				this->size = size - 2;
				if (this->size < 0)
					this->size = 0;
			}
		}

		void get_pos(int x, int y) {
			pos.x = x;
			pos.y = y;
		}

		void show() {
			setfillcolor(this->color);
			solidcircle(this->pos.x, this->pos.y, this->size);
		}
};
/*粒子类*/
class Particle {
	public:
		int x, y;
		bool firework;
		Int_Vec pos, origin, vel;
		Double_Vec acc;
		int size, radius = 20;
		bool remove = false;
		FireworkColor color;
		int explosion_radius = rand() % 18 + 5;
		int life = 0;
		//trail轨迹变量
		vector<Trail> trails;;
		vector<int> prev_posx = {-10,-10,-10, -10,-10, -10, -10, -10, -10, -10};
		vector<int> prev_posy = { -10,-10,-10, -10,-10, -10, -10, -10, -10, -10 };

		void init(int x, int y, bool firework, FireworkColor color) {
			this->pos.x = x; this->pos.y = y;

			this->x = x;
			this->y = y;
			this->firework = firework;
			this->color = color;

			if (firework) {
				this->size = 5;
				this->vel.x = 0; this->vel.y = -(rand() % 20 + 17);
				Trail t;
				for (int i = 0; i < 5; i++) {
					t.init(i, this->size, false);
					this->trails.push_back(t);
				}
			}
			else {
				this->vel.x = rand() % 2 + (-2);
				this->vel.y = rand() % 2 + (-2);
				this->vel.x *= rand() % (this->explosion_radius + 2) + 7;
				this->vel.y *= rand() % (this->explosion_radius + 2) + 7;
				//向量
				this->size = rand() % 4 + 2;
				int tmp = rand() % 3;//随机选取
				if (tmp == 0)
					this->color.R = color.R;
				else if (tmp == 1)
					this->color.G = color.G;
				else
					this->color.B = color.B;
				//5个trails
				Trail t;
				for (int i = 0; i < 5; i++) {
					t.init(i, this->size, false);
					this->trails.push_back(t);
				}
			}
		}

		void apply_force(double force) {
			acc.x += force;
			acc.y += force;
		}

		void move() {
			if (!this->firework) {
				this->vel.x *= 0.8;
				this->vel.y *= 0.8;
			}
			this->vel.x += acc.x;
			this->vel.y += acc.y;
			this->acc.x *= 0; this->acc.y *= 0;

			if ((this->life == 0) && (!this->firework)) {
				double distance = sqrt(pow((this->pos.x - this->origin.x),2) + pow((this->pos.y - this->origin.y),2));
				if (distance > this->explosion_radius)
					this->remove = true;
			}

			this->decay();
			this->trail_update();
			this->life++;
		}

		void show() {
			setfillcolor(RGB(this->color.R,this->color.G,this->color.B));
			solidcircle(this->pos.x, this->pos.y, this->size);
		}

		void decay() {
			if ((50 > this->life) && (this->life > 10)) {
				int ran = rand() % 30;
				if (ran == 0)
					this->remove = true;
			}
			else if (this->life > 50) {
				int ran = rand() % 5;
				if (ran == 0)
					this->remove = true;
			}
		}

		void trail_update() {
			this->prev_posx.pop_back();
			this->prev_posx.insert(prev_posx.begin(), this->pos.x);
			this->prev_posy.pop_back();
			this->prev_posy.insert(prev_posy.begin(), this->pos.y);
			//小小遍历vector，就你C++这么麻烦，也没有迭代器...
			for (int i = 0; i < this->trails.size(); i++) {
				if (this->trails[i].dynamic)
					this->trails[i].get_pos(this->prev_posx[i + dynamic_offset], this->prev_posy[i + dynamic_offset]);
				else
					this->trails[i].get_pos(this->prev_posx[i + static_offset], this->prev_posy[i + static_offset]);
			}
		}
};
/*烟花类*/
class Firework {
	public:
		FireworkColor color;
		FireworkColor colors[3];
		Particle firework;
		bool exploded = false;
		vector<Particle> particles;
		Int_Vec min_max_particles;

		void init() {
			color.R = rand() % 255 + 0;
			color.G = rand() % 255 + 0;
			color.B = rand() % 255 + 0;//给color赋值
			//给colors赋值
			for(int i=0;i<3;i++){
				colors[i].R= rand() % 255 + 0;
				colors[i].G= rand() % 255 + 0;
				colors[i].B= rand() % 255 + 0;
			}

			min_max_particles.x = 100; min_max_particles.y = 225;
			firework.init(rand() % WIDTH + 0, HEIGHT, true, color);
		}

		void update() {
			if (!exploded) {
				firework.apply_force(gravity.x);
				firework.move();
				/*遍历trails*/
				for (int i = 0; i < firework.trails.size(); i++)
					firework.trails[i].show();

				this->show();

				if (firework.vel.y >= 0) {
					exploded = true;
					this->explode();
				}
			}
			else {
				for (int i = 0; i < particles.size(); i++) {
					//直接访问Particle类的变量，相当于apply_force
					particles[i].acc.x = gravity.x + rand() % 1 + (-1) / 20;
					particles[i].acc.y = gravity.y / 2 + (rand() % 8 + 1 / 100);
					particles[i].move();
					for (int t = 0; t < particles[i].trails.size(); t++)
						particles[i].trails[t].show();
				}
			}
			Sleep(1);
		}

		void explode() {
			//amount数量
			int amount = rand() % this->min_max_particles.y + this->min_max_particles.x;
			for (int i = 0; i < amount; i++) {
				Particle t;
				t.init(this->firework.pos.x, this->firework.pos.y, false, this->color);
				this->particles.push_back(t);
			}
		}

		void show() {
			setfillcolor(RGB(this->color.R,this->color.G,this->color.B));
			solidcircle(this->firework.pos.x, this->firework.pos.y, this->firework.size);
		}

		bool remove() {
			if (this->exploded) {
				for (int i = 0; i < this->particles.size(); i++) {
					if (this->particles[i].remove)
						this->particles.erase(this->particles.begin() + i);
				}
				if (this->particles.size() == 0)
					return true;
				else
					return false;
			}
		}
};

void update(vector<Firework> fireworks) {
	for (int i = 0; i < fireworks.size(); i++) {
		fireworks[i].update();
		if (fireworks[i].remove())
			fireworks.erase(fireworks.begin() + i);
	}
	//cleardevice();
}

int main() {
	gravity.x = 0; gravity.y = 0.3;
	initgraph(WIDTH,HEIGHT);
	
	vector<Firework> fireworks(2);

	while (true) {
		cleardevice();
		if (rand() % 20 == 1) {
			Firework f;
			fireworks.push_back(f);
		}

		Sleep(1);
	}
	closegraph();
	return 0;
}