from flask import Flask
from flask_restful import reqparse, Api, Resource, fields

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import fields

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@localhost/aeroportos'

db = SQLAlchemy(app)
marshmallow = Marshmallow(app)

class AeroportoDataBase(db.Model):
    __tablename__ = "Dados"
    id_aeroporto = db.Column(db.Integer, primary_key = True)
    nome_aeroporto = db.Column(db.String(256), unique = True, nullable = False)
    cidade = db.Column(db.String(256), nullable = False)
    pais = db.Column(db.String, nullable = False)
    codigo_iata = db.Column(db.String, nullable = False)
    latitude = db.Column(db.String, nullable = False)
    longitude = db.Column(db.String(256), nullable = False)
    altitude = db.Column(db.String(256), nullable = False)

    def __init__(self, id_aeroporto, nome_aeroporto, cidade, pais, codigo_iata, latitude, longitude, altitude):
        self.id_aeroporto = id_aeroporto
        self.nome_aeroporto = nome_aeroporto
        self.cidade = cidade
        self.pais = pais
        self.codigo_iata = codigo_iata
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self

    def __repr__(self):
        return f"{self.id_aeroporto, self.nome_aeroporto, self.cidade, self.pais, self.codigo_iata, self.latitude, self.longitude, self.altitude}"

class AeroportoDataBaseSchema(marshmallow.SQLAlchemyAutoSchema):
    class Meta:
        model = AeroportoDataBase
        sqla_session = db.session
  
    id_aeroporto = fields.Number()#dump_only=True)
    nome_aeroporto = fields.String(required=True)
    cidade =  fields.String(required=True)  
    pais = fields.String(required=True)
    codigo_iata = fields.String(required=True)
    latitude = fields.String(required=True)
    longitude = fields.String(required=True)
    altitude = fields.String(required=True)
      
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('id_aeroporto', type=int, help='identificador do aeroporto')
parser.add_argument('nome_aeroporto', type=str, help='nome do aeroporto')
parser.add_argument('cidade', type=str, help='cidade do aeroporto')
parser.add_argument('pais', type=str, help='país do aeroporto')
parser.add_argument('codigo_iata', type=str, help='código IATA do aeroporto')
parser.add_argument('latitude', type=str, help='latitude do aeroporto')
parser.add_argument('longitude', type=str, help='longitude do aeroporto')
parser.add_argument('altitude', type=str, help='altitude do aeroporto')

class Aeroporto(Resource):
    def get(self, codigo_iata):
        aeroporto = AeroportoDataBase.query.get(codigo_iata)
        aeroporto_schema = AeroportoDataBaseSchema()
        resp = aeroporto_schema.dump(aeroporto)
        return {"aeroporto": resp}, 200 

    def delete(self, codigo_iata):
        aeroporto = AeroportoDataBase.query.get(codigo_iata)
        db.session.delete(aeroporto)
        db.session.commit()
        return '', 204 

    def put(self, codigo_iata):
        aeroporto_json = parser.parse_args()
        aeroporto = AeroportoDataBase.query.get(codigo_iata)

        if aeroporto_json.get('id_aeroporto'):
            aeroporto.id_aeroporto = aeroporto_json.id_aeroporto
        if aeroporto_json.get('nome_aeroporto'):
            aeroporto.nome_aeroporto = aeroporto_json.nome_aeroporto
        if aeroporto_json.get('cidade'):
            aeroporto.cidade = aeroporto_json.cidade
        if aeroporto_json.get('pais'):
            aeroporto.pais = aeroporto_json.pais
        if aeroporto_json.get('latitude'):
            aeroporto.latitude = aeroporto_json.latitude
        if aeroporto_json.get('longitude'):
            aeroporto.longitude = aeroporto_json.longitude
        if aeroporto_json.get('altitude'):
            aeroporto.altitude = aeroporto_json.altitude
        
        db.session.add(aeroporto)
        db.session.commit()

        aeroporto_schema = AeroportoDataBaseSchema(only=['id_aeroporto', 'nome_aeroporto', 'cidade', 'país', 'codigo_iata', 'latitude' , 'longitude', 'altitude'])
        resp = aeroporto_schema.dump(aeroporto)
    
        return {"aeropoto": resp}, 200 

class ListaAeroporto(Resource):
    def get(self):
        aeroportos = AeroportoDataBase.query.all()
        aeroporto_schema = AeroportoDataBaseSchema(many=True) 
        resp = aeroporto_schema.dump(aeroportos)
        return {"aeroporto": resp}, 200 

    def post(self):
        aeroporto_json = parser.parse_args()
        aeroporto_schema = AeroportoDataBaseSchema()
        aeroporto = aeroporto_schema.load(aeroporto_json)
        aeroportoDataBase = AeroportoDataBase(aeroporto['id_aeroporto'], aeroporto['nome_aeroporto'], aeroporto['cidade'], aeroporto['pais'], aeroporto['codigo_iata'], aeroporto['latitude'], aeroporto['longitude'], aeroporto['altitude'])
        resp = aeroporto_schema.dump(aeroportoDataBase.create())
        return {"estacao": resp}, 201 

api.add_resource(Aeroporto, '/api/v1/aeroportos/<string:codigo_iata>')
api.add_resource(ListaAeroporto, '/api/v1/aeroportos')


if __name__ == '__main__':
  with app.app_context():
    db.create_all()
  app.run(debug=True)