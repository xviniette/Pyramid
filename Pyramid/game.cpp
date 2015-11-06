#include "game.h"

Game *Game::instance = new Game();

Game::Game()
{
}

Game* Game::getIntance()
{
    return instance;
}
