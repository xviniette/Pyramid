#include "game.h"
#include <QDebug>

Game *Game::instance = new Game();

Game::Game()
{

}

Game* Game::getIntance()
{
    return instance;
}

bool Game::start(){
  //  this->timer = new QTimer(this);
 /*   this->timer->connect(timer, SIGNAL(timeout()),this, SLOT(renderNow()));
    this->timer->start(1000/this->fps);*/
}


void Game::update()
{

}

