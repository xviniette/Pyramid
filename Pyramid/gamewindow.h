#ifndef GAMEWINDOW_H
#define GAMEWINDOW_H

#include "openglwindow.h"


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
    bool event(QEvent *event);

    void keyPressEvent(QKeyEvent *event);

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
