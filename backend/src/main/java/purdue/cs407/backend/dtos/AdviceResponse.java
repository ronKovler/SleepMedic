package purdue.cs407.backend.dtos;

public class AdviceResponse {
    private int adviceID;
    private String var;

    public AdviceResponse(int adviceID, String var) {
        this.adviceID = adviceID;
        this.var = var;
    }

    public AdviceResponse() {}

    public int getAdviceID() {
        return adviceID;
    }

    public void setAdviceID(int adviceID) {
        this.adviceID = adviceID;
    }

    public String getVar() {
        return var;
    }

    public void setVar(String var) {
        this.var = var;
    }
}
