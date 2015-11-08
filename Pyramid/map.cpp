#include "map.h"

Map::Map()
{
    this->generate();
}


void Map::generate()
{
    this->startX = 50;
    this->startY = 50;
    this->startZ = 50;

    this->nom = QString("THE MAP");
    this->blocs = new QVector<Bloc>;
    this->blocs->append(*new Bloc(0, 80, 0, 1000, 1000, 1000));
}
