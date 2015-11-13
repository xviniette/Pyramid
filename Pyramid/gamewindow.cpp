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
    this->ss = 1.0f;
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



    ++m_frame;
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
