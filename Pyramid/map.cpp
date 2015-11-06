#include "map.h"

Map::Map()
{
}

void Map::generate()
{
    this->startX = 50;
    this->startY = 50;
    this->startZ = 50;

    this->nom = QString("THE MAP");

    this->blocs->append(new Bloc(0, 100, 0, 100, 100, 100));
}
