package ar.utn.frsf.disenio.capital_humano.model;

public enum EstadoCuestionario {
    ACTIVO{
        @Override
        public boolean permiteNuevaEvaluacion() {return false;}
    },
    EN_PROCESO{
        @Override
        public boolean permiteNuevaEvaluacion() {return false;}
    },
    FINALIZADO{
        @Override
        public boolean permiteNuevaEvaluacion() {return true;}
    },
    CANCELADO{
        @Override
        public boolean permiteNuevaEvaluacion() {return true;}
    };

    public abstract boolean permiteNuevaEvaluacion();

}
