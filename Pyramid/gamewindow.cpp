#include "gamewindow.h"

#include <QtGui/QGuiApplication>
#include <QtGui/QMatrix4x4>
#include <QtGui/QOpenGLShaderProgram>
#include <QtGui/QScreen>

#include <QtCore/qmath.h>
#include <QMouseEvent>
#include <QKeyEvent>
#include <time.h>
#include <iostream>

#include <QtCore>
#include <QtGui>
#include "game.h"

using namespace std;


GameWindow::GameWindow()
{
    this->rotX = -45.0;
    this->rotY = -45.0;
    this->ss = 0.5f;
}

void GameWindow::initialize()
{
    const qreal retinaScale = devicePixelRatio();

    glViewport(0, 0, width() * retinaScale, height() * retinaScale);

    glClearColor(0.0, 0.0, 0.0, 0.0);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(-1.0, 1.0, -1.0, 1.0, -100.0, 100.0);

    Game *g = Game::getInstance();

    QTimer *timer = new QTimer(this);
    connect(timer, SIGNAL(timeout()), this, SLOT(renderNow()));
    timer->start(1000/g->fps);

}

void GameWindow::render()
{
    Game *g = Game::getInstance();
    g->update();

    glClear(GL_COLOR_BUFFER_BIT);


    glLoadIdentity();
    glScalef(ss,ss,ss);
    glRotatef(rotX,1.0f,0.0f,0.0f);
    glRotatef(rotY,0.0f,0.0f,1.0f);
    this->rotX += 1;
    this->rotY += 1;

    this->display();

    ++m_frame;
}

void GameWindow::display()
{
    glColor3f(1.0f, 1.0f, 1.0f);
    glBegin(GL_QUADS);
    uint id = 0;

    Game *g = Game::getInstance();
    QVector<Bloc> *blocs = g->map->blocs;

    for(int i = 0; i < blocs->size(); i++){
        this->drawCube(blocs->at(i).x, blocs->at(i).y, blocs->at(i).z, blocs->at(i).width, blocs->at(i).height, blocs->at(i).depth);
    }

    glEnd();
}

void GameWindow::drawCube(float x, float y, float z, float w, float h, float d)
{
    glColor3f(0.0f, 1.0f, 0.0f);     // Green
    //dessus
    glVertex3f(x,y,z);
    glVertex3f(x+w,y,z);
    glVertex3f(x+w,y,z+d);
    glVertex3f(x,y,z+d);

    glColor3f(1.0f, 0.5f, 0.0f);
    //dessous
    glVertex3f(x,y+h,z);
    glVertex3f(x+w,y+h,z);
    glVertex3f(x+w,y+h,z+d);
    glVertex3f(x,y+h,z+d);

    glColor3f(1.0f, 0.0f, 0.0f);
    //devant
    glVertex3f(x,y,z+d);
    glVertex3f(x+w,y,z+d);
    glVertex3f(x+w,y+h,z+d);
    glVertex3f(x,y+h,z+d);

    glColor3f(1.0f, 1.0f, 0.0f);
    //derriere
    glVertex3f(x,y,z);
    glVertex3f(x+w,y,z);
    glVertex3f(x+w,y+h,z);
    glVertex3f(x,y+h,z);

    glColor3f(0.0f, 0.0f, 1.0f);
    //gauche
    glVertex3f(x,y,z);
    glVertex3f(x,y,z+d);
    glVertex3f(x,y+h,z+d);
    glVertex3f(x,y+h,z);

    glColor3f(1.0f, 0.0f, 1.0f);
    //droite
    glVertex3f(x+w,y,z);
    glVertex3f(x+w,y,z+d);
    glVertex3f(x+w,y+h,z+d);
    glVertex3f(x+w,y+h,z);
}




bool GameWindow::event(QEvent *event)
{
    switch (event->type())
    {
    case QEvent::UpdateRequest:

        renderNow();
        return true;
    default:
        return QWindow::event(event);
    }
}

void GameWindow::keyPressEvent(QKeyEvent *event)
{
    Game *g = Game::getInstance();
    QString key = g->keys.key(event->key());
    if(key != ""){
        g->player->inputs[key] = true;
    }
}

void GameWindow::keyReleaseEvent(QKeyEvent *event)
{
    Game *g = Game::getInstance();
    QString key = g->keys.key(event->key());
    if(key != ""){
        g->player->inputs[key] = false;
    }
}


void GameWindow::displayColor(float alt)
{
    if (alt > 0.2)
    {
        glColor3f(01.0f, 1.0f, 1.0f);
    }
    else     if (alt > 0.1)
    {
        glColor3f(alt, 1.0f, 1.0f);
    }
    else     if (alt > 0.05f)
    {
        glColor3f(01.0f, alt, alt);
    }
    else
    {
        glColor3f(0.0f, 0.0f, 1.0f);
    }

}
