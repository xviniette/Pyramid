#ifndef GAMEWINDOW_H
#define GAMEWINDOW_H

#include "openglwindow.h"
#include "bloc.h"


struct point
{
    float x, y ,z;
};



class GameWindow : public OpenGLWindow
{
public:
    GameWindow();

    void initialize();
    void update();
    void render();
    void display();
    void drawCube(float x, float y, float z, float w, float h, float d);
    bool event(QEvent *event);

    void keyPressEvent(QKeyEvent *event);
    void keyReleaseEvent(QKeyEvent *event);

    void displayColor(float);

private:

    int m_frame;
    QImage m_image;
    point *p;

    float rotX;
    float rotY;
    float ss;

};


#endif // GAMEWINDOW_H
