#ifndef GAME_H
#define GAME_H

#include <QTimer>

#include "player.h"
#include "bloc.h"
#include "map.h"
#include "game.h"

class Game
{
public:
    Game();
    static Game *getIntance();
    void update();
    static Game *instance;

    bool start();
private:
    Player *player;
    Map *map;
    QTimer *timer;
    int fps = 30;

};

#endif // GAME_H
