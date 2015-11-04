#ifndef PLAYER_H
#define PLAYER_H

#include "bloc.h"

class Player
{
public:
    Player();
    void setPosition(float x, float y, float z);
    void update();

private:
    float x, y, z, dirX, dirY, width, height, depth;
};

#endif // PLAYER_H
