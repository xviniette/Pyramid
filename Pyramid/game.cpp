#include "game.h"
#include <QDebug>

Game *Game::instance = new Game();

Game::Game()
{
    this->fps = 60;
    //Gestions des touches
    this->keys["u"] = 90;
    this->keys["d"] = 83;
    this->keys["l"] = 81;
    this->keys["r"] = 68;
    this->keys["j"] = 32;
    this->keys["c"] = 16777249;
}

Game* Game::getInstance()
{
    return instance;
}

bool Game::start(){

    this->map = new Map();
    this->player = new Player();
    return true;
}


void Game::update()
{
    //qDebug()<<"lol";
   //this->player->update();
}
