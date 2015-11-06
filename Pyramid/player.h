#ifndef PLAYER_H
#define PLAYER_H

#include "bloc.h"
#include <QMap>
#include <QString>


class Player
{
public:
    Player();
    void setPosition(float x, float y, float z);
    void update();
    bool hasCollision(Bloc b);
    QMap<QString, float> *getDeltaToMove(Bloc b);

    float x, y, z, velX, velY, velZ, dirX, dirY = 0;
    float width = 20;
    float height = 40;
    float depth = 20;
    float  gravity = 1.5;
    float  maxGravity = 10;
    float jump = 5;
    float speed = 15;

    QString pseudo;
    QMap<QString, bool> inputs;
};

#endif // PLAYER_H
